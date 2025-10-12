package com.grupog.grpc;

import com.grupog.inventario.*;
import com.grupog.producers.SolicitudDonacionProducer;
import com.grupog.producers.TransferenciaDonacionProducer;
import com.grupog.entities.SolicitudExternaEntity;
import com.grupog.repositories.SolicitudExternaRepository;
import com.grupog.service.ItemInventarioService;
import com.grupog.events.SolicitudDonacionEvent;
import com.grupog.events.TransferirDonacionEvent;
import org.springframework.beans.factory.annotation.Value;
import java.time.ZoneOffset;
import com.grupog.entities.ItemInventarioEntity;
import com.grupog.repositories.ItemInventarioRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@GrpcService
public class InventarioGrpcService extends InventarioServiceGrpc.InventarioServiceImplBase {

    private final ItemInventarioRepository repository;

    @Autowired
    private SolicitudDonacionProducer solicitudProducer;

    @Autowired
    private TransferenciaDonacionProducer transferenciaProducer;

    @Autowired
    private SolicitudExternaRepository solicitudExternaRepository;

    @Autowired
    private ItemInventarioService inventarioService;

    @Value("${organizacion.id}")
    private Long idOrganizacion;

    @Autowired
    public InventarioGrpcService(ItemInventarioRepository repository) {
        this.repository = repository;
    }

    private InventarioItem toProto(ItemInventarioEntity e) {
        return InventarioItem.newBuilder()
                .setId(e.getId() == null ? 0 : e.getId())
                .setCategoria(parseCategoria(e.getCategoria()))
                .setDescripcion(e.getDescripcion() == null ? "" : e.getDescripcion())
                .setCantidad(e.getCantidad())
                .setEliminado(e.isEliminado())
                .setFechaAlta(e.getFechaAlta() == null ? 0 : e.getFechaAlta().toEpochMilli())
                .setUsuarioAlta(e.getUsuarioAlta() == null ? "" : e.getUsuarioAlta())
                .setFechaModificacion(e.getFechaModificacion() == null ? 0 : e.getFechaModificacion().toEpochMilli())
                .setUsuarioModificacion(e.getUsuarioModificacion() == null ? "" : e.getUsuarioModificacion())
                .build();
    }

    private CategoriaInventario parseCategoria(String c) {
        if (c == null)
            return CategoriaInventario.ROPA;
        try {
            return CategoriaInventario.valueOf(c);
        } catch (Exception ex) {
            return CategoriaInventario.ROPA;
        }
    }

    private String categoriaToString(CategoriaInventario c) {
        return c == null ? "ROPA" : c.name();
    }

    @Override
    public void crearItem(CrearItemRequest request, StreamObserver<InventarioItem> responseObserver) {
        try {
            if (request.getCantidad() < 0) {
                responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("La cantidad no puede ser negativa")
                        .asRuntimeException());
                return;
            }
            ItemInventarioEntity e = new ItemInventarioEntity();
            e.setCategoria(categoriaToString(request.getCategoria()));
            e.setDescripcion(request.getDescripcion());
            e.setCantidad(request.getCantidad());
            e.setEliminado(false);
            e.setFechaAlta(Instant.now());
            e.setUsuarioAlta(request.getUsuarioEjecutor());
            e = repository.save(e);
            responseObserver.onNext(toProto(e));
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(
                    Status.INTERNAL.withDescription("Error creando item: " + ex.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void actualizarItem(ActualizarItemRequest request, StreamObserver<InventarioItem> responseObserver) {
        try {
            Optional<ItemInventarioEntity> opt = repository.findByIdAndEliminadoFalse(request.getId());
            if (opt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND.withDescription("Item no encontrado").asRuntimeException());
                return;
            }
            if (request.getCantidad() < 0) {
                responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("La cantidad no puede ser negativa")
                        .asRuntimeException());
                return;
            }
            ItemInventarioEntity e = opt.get();
            e.setDescripcion(request.getDescripcion());
            e.setCantidad(request.getCantidad());
            e.setFechaModificacion(Instant.now());
            e.setUsuarioModificacion(request.getUsuarioEjecutor());
            e = repository.save(e);
            responseObserver.onNext(toProto(e));
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(Status.INTERNAL.withDescription("Error actualizando item: " + ex.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void bajaLogicaItem(BajaLogicaItemRequest request, StreamObserver<RespuestaExito> responseObserver) {
        try {
            Optional<ItemInventarioEntity> opt = repository.findById(request.getId());
            if (opt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND.withDescription("Item no encontrado").asRuntimeException());
                return;
            }
            ItemInventarioEntity e = opt.get();
            e.setEliminado(true);
            e.setFechaModificacion(Instant.now());
            e.setUsuarioModificacion(request.getUsuarioEjecutor());
            repository.save(e);
            responseObserver.onNext(RespuestaExito.newBuilder().setExito(true).setMensaje("Item dado de baja").build());
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(
                    Status.INTERNAL.withDescription("Error en baja lógica: " + ex.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void listarItems(ListarItemsRequest request, StreamObserver<ListaItemsResponse> responseObserver) {
        try {
            List<ItemInventarioEntity> list = request.getIncluirEliminados() ? repository.findAll()
                    : repository.findByEliminadoFalse();
            List<InventarioItem> items = list.stream().map(this::toProto).collect(Collectors.toList());
            responseObserver.onNext(ListaItemsResponse.newBuilder().addAllItems(items).build());
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(
                    Status.INTERNAL.withDescription("Error listando items: " + ex.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void buscarItemPorId(BuscarItemPorIdRequest request, StreamObserver<InventarioItem> responseObserver) {
        try {
            Optional<ItemInventarioEntity> opt = repository.findById(request.getId());
            if (opt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND.withDescription("Item no encontrado").asRuntimeException());
                return;
            }
            responseObserver.onNext(toProto(opt.get()));
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(
                    Status.INTERNAL.withDescription("Error buscando item: " + ex.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void registrarSalida(RegistrarSalidaRequest request, StreamObserver<RespuestaExito> responseObserver) {
        try {
            if (request.getCantidad() <= 0) {
                responseObserver.onError(
                        Status.INVALID_ARGUMENT.withDescription("La cantidad debe ser positiva").asRuntimeException());
                return;
            }
            Optional<ItemInventarioEntity> opt = repository.findFirstByCategoriaAndDescripcionAndEliminadoFalse(
                    categoriaToString(request.getCategoria()), request.getDescripcion());
            if (opt.isEmpty()) {
                responseObserver.onError(
                        Status.NOT_FOUND.withDescription("Item de inventario no encontrado").asRuntimeException());
                return;
            }
            ItemInventarioEntity e = opt.get();
            if (e.getCantidad() < request.getCantidad()) {
                responseObserver
                        .onError(Status.FAILED_PRECONDITION.withDescription("Stock insuficiente").asRuntimeException());
                return;
            }
            e.setCantidad(e.getCantidad() - request.getCantidad());
            e.setFechaModificacion(Instant.now());
            e.setUsuarioModificacion(request.getUsuarioEjecutor());
            repository.save(e);
            responseObserver.onNext(RespuestaExito.newBuilder().setExito(true).setMensaje("Salida registrada").build());
            responseObserver.onCompleted();
        } catch (Exception ex) {
            responseObserver.onError(Status.INTERNAL.withDescription("Error registrando salida: " + ex.getMessage())
                    .asRuntimeException());
        }
    }

    /**
     * Solicitar donaciones a la red de ONGs (Punto 1)
     */
    @Override
    public void solicitarDonaciones(SolicitarDonacionesRequest request,
            StreamObserver<SolicitarDonacionesResponse> responseObserver) {
        try {
            // Crear evento Kafka
            SolicitudDonacionEvent solicitud = new SolicitudDonacionEvent();
            solicitud.setIdSolicitud("SOL-" + System.currentTimeMillis());
            solicitud.setIdOrganizacionSolicitante(idOrganizacion);

            // Convertir de proto a Event
            List<SolicitudDonacionEvent.DonacionItem> donaciones = request.getDonacionesList()
                    .stream()
                    .map(d -> {
                        SolicitudDonacionEvent.DonacionItem item = new SolicitudDonacionEvent.DonacionItem();
                        item.setCategoria(d.getCategoria());
                        item.setDescripcion(d.getDescripcion());
                        item.setCantidad(d.getCantidad());
                        return item;
                    })
                    .collect(Collectors.toList());

            solicitud.setDonaciones(donaciones);

            // Enviar a Kafka
            solicitudProducer.enviarSolicitud(solicitud);

            // Responder
            SolicitarDonacionesResponse response = SolicitarDonacionesResponse.newBuilder()
                    .setIdSolicitud(solicitud.getIdSolicitud())
                    .setMensaje("Solicitud enviada a la red de ONGs")
                    .setExito(true)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception ex) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error enviando solicitud: " + ex.getMessage())
                    .asRuntimeException());
        }
    }

    /**
     * Listar solicitudes externas recibidas (Punto 1)
     */
    @Override
    public void listarSolicitudesExternas(ListarSolicitudesExternasRequest request,
            StreamObserver<ListarSolicitudesExternasResponse> responseObserver) {
        try {
            List<SolicitudExternaEntity> solicitudes = request.getSoloActivas()
                    ? solicitudExternaRepository.findByActivaTrue()
                    : solicitudExternaRepository.findAll();

            List<SolicitudExterna> protoSolicitudes = solicitudes.stream()
                    .map(s -> {
                        // Convertir donaciones
                        List<DonacionItem> items = s.getDonaciones().stream()
                                .map(d -> DonacionItem.newBuilder()
                                        .setCategoria(d.getCategoria())
                                        .setDescripcion(d.getDescripcion())
                                        .setCantidad(0)
                                        .build())
                                .collect(Collectors.toList());

                        return SolicitudExterna.newBuilder()
                                .setIdSolicitud(s.getIdSolicitud())
                                .setIdOrganizacionSolicitante(s.getIdOrganizacionSolicitante())
                                .addAllDonaciones(items)
                                .setActiva(s.getActiva())
                                .setFechaRecepcion(s.getFechaRecepcion()
                                        .toEpochSecond(ZoneOffset.UTC))
                                .build();
                    })
                    .collect(Collectors.toList());

            responseObserver.onNext(ListarSolicitudesExternasResponse.newBuilder()
                    .addAllSolicitudes(protoSolicitudes)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception ex) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error listando solicitudes: " + ex.getMessage())
                    .asRuntimeException());
        }
    }

    /**
     * Transferir donaciones a una organización solicitante (Punto 2)
     */
    @Override
    public void transferirDonacion(TransferirDonacionRequest request,
            StreamObserver<RespuestaExito> responseObserver) {
        try {
            // 1. Verificar solicitud existe y está activa
            Optional<SolicitudExternaEntity> optSolicitud = solicitudExternaRepository
                    .findById(request.getIdSolicitud());

            if (optSolicitud.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Solicitud no encontrada")
                        .asRuntimeException());
                return;
            }

            if (!optSolicitud.get().getActiva()) {
                responseObserver.onError(Status.FAILED_PRECONDITION
                        .withDescription("Solicitud no está activa")
                        .asRuntimeException());
                return;
            }

            List<SolicitudDonacionEvent.DonacionItem> donaciones = request.getDonacionesList()
                    .stream()
                    .map(d -> {
                        SolicitudDonacionEvent.DonacionItem item = new SolicitudDonacionEvent.DonacionItem();
                        item.setCategoria(d.getCategoria());
                        item.setDescripcion(d.getDescripcion());
                        item.setCantidad(d.getCantidad());
                        return item;
                    })
                    .collect(Collectors.toList());

            // Descontar del inventario
            boolean stockOk = inventarioService.descontarStock(donaciones);
            if (!stockOk) {
                responseObserver.onError(Status.FAILED_PRECONDITION
                        .withDescription("Stock insuficiente o item no encontrado")
                        .asRuntimeException());
                return;
            }

            // Crear evento y enviar a Kafka
            TransferirDonacionEvent transferencia = new TransferirDonacionEvent();
            transferencia.setIdSolicitud(request.getIdSolicitud());
            transferencia.setIdOrganizacionDonante(idOrganizacion.toString());
            transferencia.setDonaciones(donaciones);

            transferenciaProducer.enviarTransferencia(transferencia);

            // Responder
            responseObserver.onNext(RespuestaExito.newBuilder()
                    .setMensaje("Transferencia enviada. Stock descontado correctamente.")
                    .setExito(true)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception ex) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error en transferencia: " + ex.getMessage())
                    .asRuntimeException());
        }
    }
}
