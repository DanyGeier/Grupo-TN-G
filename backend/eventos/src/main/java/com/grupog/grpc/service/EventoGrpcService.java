package com.grupog.grpc.service;

import com.grupog.*;
import com.grupog.documents.EventoDocument;
import com.grupog.repositories.EventoRepository;
import com.grupog.service.JwtService;
import com.grupog.service.UsuarioGrpcClient;
import com.grupog.service.InventarioGrpcClient;
import com.grupog.mappers.EventoMapper;
import com.grupog.configs.ContextKeys;

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

    // Usar la clave compartida del contexto gRPC

    @Override
    public void crearEvento(CrearEventoRequest request, StreamObserver<Evento> responseObserver) {
        try {
            System.out.println("[EVENTO SERVICE] Iniciando creación de evento: " + request.getNombreEvento());

            // Extraer token desde el contexto
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: " +
                    (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

            // Validar JWT y obtener usuario
            Usuario usuario = validarTokenYUsuario(token);
            System.out.println("[EVENTO SERVICE] Usuario validado: " + usuario.getNombreUsuario() + " (ID: "
                    + usuario.getId() + ")");

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
    public void modificarEvento(Evento request, StreamObserver<Evento> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

            // Validar JWT y obtener usuario
            Usuario usuario = validarTokenYUsuario(token);

            // Validar rol (PRESIDENTE o COORDINADOR)
            if (!esPresidenteOCoordinador(usuario)) {
                responseObserver.onError(Status.PERMISSION_DENIED
                        .withDescription("Solo PRESIDENTE o COORDINADOR pueden modificar eventos")
                        .asRuntimeException());
                return;
            }

            // Validar ID
            if (request.getId() == null || request.getId().trim().isEmpty()) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("ID de evento requerido")
                        .asRuntimeException());
                return;
            }

            // Buscar evento existente y activo
            Optional<EventoDocument> eventoOpt = eventoRepository.findByIdAndActivoTrue(request.getId());
            if (eventoOpt.isEmpty()) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Evento no encontrado")
                        .asRuntimeException());
                return;
            }

            EventoDocument evento = eventoOpt.get();

            // Validar que el evento actual sea futuro
            if (evento.getFechaHoraEvento().isBefore(LocalDateTime.now())) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("Solo se pueden modificar eventos futuros")
                        .asRuntimeException());
                return;
            }

            // Validar que la nueva fecha sea futura
            LocalDateTime nuevaFecha = LocalDateTime.ofInstant(
                    java.time.Instant.ofEpochMilli(request.getFechaHoraEvento()),
                    ZoneId.systemDefault());
            if (nuevaFecha.isBefore(LocalDateTime.now())) {
                responseObserver.onError(Status.INVALID_ARGUMENT
                        .withDescription("La nueva fecha/hora debe ser futura")
                        .asRuntimeException());
                return;
            }

            // Actualizar campos permitidos
            if (request.getNombreEvento() != null && !request.getNombreEvento().trim().isEmpty()) {
                evento.setNombreEvento(request.getNombreEvento());
            }
            evento.setDescripcion(request.getDescripcion()); // puede ser vacía
            evento.setFechaHoraEvento(nuevaFecha);

            EventoDocument guardado = eventoRepository.save(evento);

            responseObserver.onNext(eventoMapper.toProto(guardado));
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al modificar evento: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void asignarParticipante(AsignarParticipanteRequest request,
            StreamObserver<RespuestaExito> responseObserver) {
        try {
            // Extraer token desde el contexto
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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

            // Validar stock y descontar (cliente simulado o real según implementación)
            if (!inventarioGrpcClient.verificarDisponibilidad(request.getCategoria().name(), request.getCantidad())) {
                responseObserver.onError(Status.FAILED_PRECONDITION
                        .withDescription("Stock insuficiente en inventario")
                        .asRuntimeException());
                return;
            }
            inventarioGrpcClient.descontarDonacion(
                    request.getCategoria().name(),
                    request.getDescripcion(),
                    request.getCantidad(),
                    usuario.getId());

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
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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
            String token = ContextKeys.TOKEN_KEY.get();
            System.out.println("[EVENTO SERVICE] Token extraído del contexto: "
                    + (token != null ? "Token presente (longitud: " + token.length() + ")" : "Token NULL"));

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
            System.out.println("[JWT VALIDATION] Iniciando validación de token");

            // Validar que el token no sea nulo o vacío
            if (token == null || token.trim().isEmpty()) {
                System.out.println("[JWT VALIDATION] ERROR: Token no proporcionado o vacío");
                throw new RuntimeException("Token no proporcionado");
            }
            System.out.println("[JWT VALIDATION] Token recibido - Longitud: " + token.length());

            // Validar el token JWT
            System.out.println("[JWT VALIDATION] Validando token con JwtService");
            if (!jwtService.validateToken(token)) {
                System.out.println("[JWT VALIDATION] ERROR: Token inválido o expirado");
                throw new RuntimeException("Token inválido o expirado");
            }
            System.out.println("[JWT VALIDATION] Token válido según JwtService");

            // Extraer el nombre de usuario del token
            System.out.println("[JWT VALIDATION] Extrayendo username del token");
            String username = jwtService.extractUsername(token);
            System.out.println("[JWT VALIDATION] Username extraído: " + username);

            // Buscar el usuario en el servicio de usuarios
            System.out.println("[JWT VALIDATION] Buscando usuario en servicio de usuarios");
            Usuario usuario = usuarioGrpcClient.buscarUsuarioPorNombreUsuario(username);

            if (usuario == null) {
                System.out.println("[JWT VALIDATION] ERROR: Usuario no encontrado en servicio de usuarios");
                throw new RuntimeException("Usuario no encontrado o inactivo");
            }
            System.out.println("[JWT VALIDATION] Usuario encontrado - ID: " + usuario.getId() + ", Estado: "
                    + usuario.getEstado());

            // Validar que el usuario existe y está activo
            if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
                System.out.println("[JWT VALIDATION] ERROR: Usuario inactivo - Estado: " + usuario.getEstado());
                throw new RuntimeException("Usuario no encontrado o inactivo");
            }
            System.out.println("[JWT VALIDATION] Usuario validado exitosamente");

            return usuario;
        } catch (Exception e) {
            System.out.println("[JWT VALIDATION] ERROR: " + e.getMessage());
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
