package com.grupog.grpc.service;

import com.grupog.*;
import com.grupog.documents.EventoDocument;
import com.grupog.repositories.EventoRepository;
import com.grupog.service.JwtService;
import com.grupog.service.UsuarioGrpcClient;
import com.grupog.service.InventarioGrpcClient;
import com.grupog.mappers.EventoMapper;

import io.grpc.Context;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@GrpcService
public class EventoGrpcService extends EventoServiceGrpc.EventoServiceImplBase {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioGrpcClient usuarioGrpcClient;

    @Autowired
    private InventarioGrpcClient inventarioGrpcClient;

    @Autowired
    private EventoMapper eventoMapper;

    // Clave para el contexto gRPC
    private static final Context.Key<String> TOKEN_KEY = Context.key("token");

    @Override
    public void crearEvento(CrearEventoRequest request, StreamObserver<Evento> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT y obtener usuario
            Usuario usuario = validarTokenYUsuario(token);

            // Validar rol (PRESIDENTE o COORDINADOR)
            if (!esPresidenteOCoordinador(usuario)) {
                responseObserver.onError(Status.PERMISSION_DENIED
                        .withDescription("Solo PRESIDENTE o COORDINADOR pueden crear eventos")
                        .asRuntimeException());
                return;
            }

            // Validar que la fecha sea futura
            LocalDateTime fechaEvento = LocalDateTime.ofInstant(
                    java.time.Instant.ofEpochMilli(request.getFechaHoraEvento()),
                    ZoneId.systemDefault());

            if (fechaEvento.isBefore(LocalDateTime.now())) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("No se pueden crear eventos en fechas pasadas")
                        .asRuntimeException());
                return;
            }

            // Crear evento
            EventoDocument evento = eventoMapper.toDocument(request, usuario.getId());
            EventoDocument eventoGuardado = eventoRepository.save(evento);

            // Convertir a proto y responder
            Evento eventoProto = eventoMapper.toProto(eventoGuardado);
            responseObserver.onNext(eventoProto);
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al crear evento: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void asignarParticipante(AsignarParticipanteRequest request,
            StreamObserver<RespuestaExito> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT y obtener usuario actual
            Usuario usuarioActual = validarTokenYUsuario(token);

            // Obtener evento
            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getEventoId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }
            EventoDocument evento = eventoOpt.get();

            // Validar permisos según rol
            if (!puedeAsignarParticipante(usuarioActual, request.getUsuarioId())) {
                responseObserver.onError(Status.PERMISSION_DENIED
                        .withDescription("No tiene permisos para asignar este participante")
                        .asRuntimeException());
                return;
            }

            // TODO: Validar que el usuario a asignar existe y está activo
            // Usuario usuarioAsignar =
            // usuarioGrpcClient.buscarUsuarioPorId(request.getUsuarioId());
            // if (usuarioAsignar.getEstado() != EstadoUsuario.ACTIVO) {
            // responseObserver.onError(Status.INVALID_ARGUMENT
            // .withDescription("El usuario no está activo")
            // .asRuntimeException());
            // return;
            // }

            // Agregar participante si no existe
            if (!evento.getParticipantesIds().contains(request.getUsuarioId())) {
                evento.getParticipantesIds().add(request.getUsuarioId());
                eventoRepository.save(evento);
            }

            responseObserver.onNext(RespuestaExito.newBuilder()
                    .setMensaje("Participante asignado correctamente")
                    .setExito(true)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al asignar participante: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void quitarParticipante(QuitarParticipanteRequest request, StreamObserver<RespuestaExito> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT y obtener usuario actual
            Usuario usuarioActual = validarTokenYUsuario(token);

            // Obtener evento
            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getEventoId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }
            EventoDocument evento = eventoOpt.get();

            // Validar permisos según rol
            if (!puedeAsignarParticipante(usuarioActual, request.getUsuarioId())) {
                responseObserver.onError(Status.PERMISSION_DENIED
                        .withDescription("No tiene permisos para quitar este participante")
                        .asRuntimeException());
                return;
            }

            // Quitar participante si existe
            if (evento.getParticipantesIds().contains(request.getUsuarioId())) {
                evento.getParticipantesIds().remove(request.getUsuarioId());
                eventoRepository.save(evento);
            }

            responseObserver.onNext(RespuestaExito.newBuilder()
                    .setMensaje("Participante quitado correctamente")
                    .setExito(true)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al quitar participante: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void registrarDonacionRepartida(RegistrarDonacionRequest request,
            StreamObserver<RespuestaExito> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT
            Usuario usuario = validarTokenYUsuario(token);

            // Obtener evento
            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getEventoId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }
            EventoDocument evento = eventoOpt.get();

            // Validar que el evento sea pasado
            if (evento.getFechaHoraEvento().isAfter(LocalDateTime.now())) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("Solo se pueden registrar donaciones en eventos pasados")
                        .asRuntimeException());
                return;
            }

            // TODO: Descontar del inventario via gRPC
            // inventarioGrpcClient.descontarDonacion(
            // request.getCategoria().name(),
            // request.getDescripcion(),
            // request.getCantidad());

            // Registrar donación repartida localmente
            EventoDocument.DonacionRepartidaSimple donacion = new EventoDocument.DonacionRepartidaSimple(
                    request.getCategoria().name(),
                    request.getDescripcion(),
                    request.getCantidad(),
                    LocalDateTime.now(),
                    usuario.getId(),
                    usuario.getNombreUsuario());

            evento.getDonacionesRepartidas().add(donacion);
            eventoRepository.save(evento);

            responseObserver.onNext(RespuestaExito.newBuilder()
                    .setMensaje("Donación registrada correctamente")
                    .setExito(true)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al registrar donación: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void listarEventos(ListarEventosRequest request, StreamObserver<ListaEventosResponse> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT (solo verificar que sea válido, no necesitamos el usuario
            // completo)
            if (token == null || token.trim().isEmpty() || !jwtService.validateToken(token)) {
                responseObserver.onError(Status.UNAUTHENTICATED
                        .withDescription("Token inválido")
                        .asRuntimeException());
                return;
            }

            List<EventoDocument> eventos;

            if (request.getSoloFuturos()) {
                eventos = eventoRepository.findByFechaHoraEventoAfterAndActivoTrue(LocalDateTime.now());
            } else {
                eventos = eventoRepository.findByActivoTrue();
            }

            List<Evento> eventosProto = eventos.stream()
                    .map(eventoMapper::toProto)
                    .collect(java.util.stream.Collectors.toList());

            responseObserver.onNext(ListaEventosResponse.newBuilder()
                    .addAllEventos(eventosProto)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al listar eventos: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void buscarEventoPorId(BuscarEventoPorIdRequest request, StreamObserver<Evento> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT
            validarTokenYUsuario(token);

            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }

            Evento evento = eventoMapper.toProto(eventoOpt.get());
            responseObserver.onNext(evento);
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al buscar evento: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void eliminarEvento(BuscarEventoPorIdRequest request, StreamObserver<RespuestaExito> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = TOKEN_KEY.get();
            System.out.println("DEBUG Service: Token extraído del contexto: "
                    + (token != null ? token.substring(0, Math.min(token.length(), 50)) + "..." : "null"));

            // Validar JWT y obtener usuario
            Usuario usuario = validarTokenYUsuario(token);

            // Validar rol (PRESIDENTE o COORDINADOR)
            if (!esPresidenteOCoordinador(usuario)) {
                responseObserver.onError(Status.PERMISSION_DENIED
                        .withDescription("Solo PRESIDENTE o COORDINADOR pueden eliminar eventos")
                        .asRuntimeException());
                return;
            }

            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }

            EventoDocument evento = eventoOpt.get();

            // Validar que el evento sea futuro
            if (evento.getFechaHoraEvento().isBefore(LocalDateTime.now())) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("Solo se pueden eliminar eventos futuros")
                        .asRuntimeException());
                return;
            }

            // Eliminación física
            eventoRepository.delete(evento);

            responseObserver.onNext(RespuestaExito.newBuilder()
                    .setMensaje("Evento eliminado correctamente")
                    .setExito(true)
                    .build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al eliminar evento: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    // Métodos auxiliares
    private Usuario validarTokenYUsuario(String token) {
        try {
            // TEMPORAL: Deshabilitar validación JWT para pruebas
            // TODO: Rehabilitar validación JWT cuando esté funcionando correctamente

            // Simulación temporal - siempre retorna un usuario válido
            return Usuario.newBuilder()
                    .setId(1L)
                    .setNombreUsuario("admin")
                    .setNombre("Administrador")
                    .setApellido("Sistema")
                    .setEmail("admin@grupo.com")
                    .setRol(Rol.PRESIDENTE)
                    .setEstado(EstadoUsuario.ACTIVO)
                    .setFechaCreacion(System.currentTimeMillis())
                    .build();

            /*
             * VALIDACIÓN JWT COMENTADA TEMPORALMENTE
             * if (token == null || token.trim().isEmpty()) {
             * throw new RuntimeException("Token no proporcionado");
             * }
             * 
             * String username = jwtService.extractUsername(token);
             * // TODO: Implementar llamada real al servicio de usuarios
             * // return usuarioGrpcClient.buscarUsuarioPorNombreUsuario(username);
             * 
             * // Simulación temporal
             * return Usuario.newBuilder()
             * .setId(1L)
             * .setNombreUsuario(username)
             * .setNombre("Usuario")
             * .setApellido("Temporal")
             * .setEmail("temp@example.com")
             * .setRol(Rol.PRESIDENTE)
             * .setEstado(EstadoUsuario.ACTIVO)
             * .setFechaCreacion(System.currentTimeMillis())
             * .build();
             */
        } catch (Exception e) {
            throw new RuntimeException("Token inválido: " + e.getMessage());
        }
    }

    private Long validarTokenYExtraerUsuarioId(String token) {
        try {
            // TEMPORAL: Deshabilitar validación JWT para pruebas
            // TODO: Rehabilitar validación JWT cuando esté funcionando correctamente

            // Simulación temporal - siempre retorna usuario ID 1
            return 1L;

            /*
             * VALIDACIÓN JWT COMENTADA TEMPORALMENTE
             * if (token == null || token.trim().isEmpty()) {
             * throw new RuntimeException("Token no proporcionado");
             * }
             * 
             * String username = jwtService.extractUsername(token);
             * // TODO: Implementar llamada real al servicio de usuarios
             * // Usuario usuario =
             * usuarioGrpcClient.buscarUsuarioPorNombreUsuario(username);
             * // return usuario.getId();
             * 
             * // Simulación temporal
             * return 1L;
             */
        } catch (Exception e) {
            throw new RuntimeException("Token inválido: " + e.getMessage());
        }
    }

    private boolean esPresidenteOCoordinador(Usuario usuario) {
        return usuario.getRol() == Rol.PRESIDENTE || usuario.getRol() == Rol.COORDINADOR;
    }

    private boolean puedeAsignarParticipante(Usuario usuarioActual, Long usuarioIdAsignar) {
        if (usuarioActual.getRol() == Rol.PRESIDENTE || usuarioActual.getRol() == Rol.COORDINADOR) {
            return true; // Pueden asignar a cualquier usuario
        } else if (usuarioActual.getRol() == Rol.VOLUNTARIO) {
            return usuarioActual.getId() == usuarioIdAsignar; // Solo pueden asignarse a sí mismos
        }
        return false;
    }
}
