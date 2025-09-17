package com.grupog.grpc.service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.grupog.ActualizarUsuarioRequest;
import com.grupog.BuscarUsuarioPorIdRequest;
import com.grupog.CrearUsuarioRequest;
import com.grupog.EstadoUsuario;
import com.grupog.ListaUsuariosResponse;
import com.grupog.ListarUsuariosRequest;
import com.grupog.LoginData;
import com.grupog.Rol;
import com.grupog.Usuario;
import com.grupog.UsuarioServiceGrpc.UsuarioServiceImplBase;
import com.grupog.entities.RolEntity;
import com.grupog.entities.UsuarioEntity;
import com.grupog.RespuestaExito;
import com.grupog.repositories.RolRepository;
import com.grupog.repositories.UsuarioRepository;

import io.grpc.stub.StreamObserver;
//import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UsuarioGrpcService extends UsuarioServiceImplBase {

	private final UsuarioRepository usuarioRepository;
	private final RolRepository rolRepository;

	public UsuarioGrpcService(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
		this.usuarioRepository = usuarioRepository;
		this.rolRepository = rolRepository;
	}

	private Usuario toProto(UsuarioEntity e) {
		return Usuario.newBuilder()
				.setId(e.getIdUsuario())
				.setNombreUsuario(e.getNombreUsuario())
				.setNombre(e.getNombre())
				.setApellido(e.getApellido())
				.setTelefono(e.getTelefono() != null ? e.getTelefono() : "")
				.setEmail(e.getEmail())
				.setRol(mapRolEntityToProto(e.getRol()))
				.setEstado(e.isActivo() ? EstadoUsuario.ACTIVO : EstadoUsuario.INACTIVO)
				.setFechaCreacion(e.getFechaCreacion() != null ? e.getFechaCreacion().toEpochMilli()
						: Instant.now().toEpochMilli())
				.build();
	}

	private UsuarioEntity toEntity(CrearUsuarioRequest request) {
		UsuarioEntity entity = new UsuarioEntity();
		entity.setNombreUsuario(request.getNombreUsuario());
		entity.setNombre(request.getNombre());
		entity.setApellido(request.getApellido());
		entity.setTelefono(request.getTelefono());
		entity.setEmail(request.getEmail());
		entity.setClave("changeme"); // TODO Ver clave
		entity.setActivo(true);
		entity.setRol(mapRolProtoToEntity(request.getRol()));
		entity.setFechaCreacion(Instant.now());
		return entity;
	}

	private Rol mapRolEntityToProto(RolEntity rolEntity) {
		String nombre = rolEntity.getAuthority().replace("ROLE_", "");
		return Rol.valueOf(nombre);
	}

	private RolEntity mapRolProtoToEntity(Rol rol) {
		return rolRepository.findByNombreRol(rol.name())
				.orElseThrow(() -> new IllegalStateException("Rol inválido: " + rol.name()));
	}

	@Override
	public void listarUsuarios(ListarUsuariosRequest request, StreamObserver<ListaUsuariosResponse> responseObserver) {
		List<Usuario> usuarios = usuarioRepository.findAll()
				.stream()
				.map(this::toProto).collect(Collectors.toList());
		ListaUsuariosResponse response = ListaUsuariosResponse.newBuilder().addAllUsuarios(usuarios).build();
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

	@Override
	public void registrarUsuario(CrearUsuarioRequest request, StreamObserver<Usuario> responseObserver) {

		if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
			responseObserver.onError(new IllegalStateException("El nombre de usuario ya existe"));
			return;
		}
		if (usuarioRepository.existsByEmail(request.getEmail())) {
			responseObserver.onError(new IllegalStateException("El email ya existe"));
			return;
		}

		UsuarioEntity entity = toEntity(request);
		UsuarioEntity guardado = usuarioRepository.save(entity);
		Usuario usuario = toProto(guardado);
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

	@Override
	public void buscarUsuarioPorId(BuscarUsuarioPorIdRequest request, StreamObserver<Usuario> responseObserver) {
		UsuarioEntity entity = usuarioRepository.findById(request.getId())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		Usuario usuario = toProto(entity);
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

	@Override
	public void desactivarUsuario(BuscarUsuarioPorIdRequest request, StreamObserver<RespuestaExito> responseObserver) {
		UsuarioEntity entity = usuarioRepository.findById(request.getId())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		entity.setActivo(false);
		usuarioRepository.save(entity);
		responseObserver.onNext(RespuestaExito.newBuilder().setMensaje("Usuario desactivado").setExito(true).build());
		responseObserver.onCompleted();
	}

	@Override
	public void actualizarUsuario(ActualizarUsuarioRequest request, StreamObserver<Usuario> responseObserver) {
		UsuarioEntity entity = usuarioRepository.findById(request.getId())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		entity.setNombreUsuario(request.getNombreUsuario());
		entity.setNombre(request.getNombre());
		entity.setApellido(request.getApellido());
		entity.setTelefono(request.getTelefono());
		entity.setEmail(request.getEmail());
		entity.setRol(mapRolProtoToEntity(request.getRol()));
		entity.setActivo(request.getEstado() == EstadoUsuario.ACTIVO);

		UsuarioEntity guardado = usuarioRepository.save(entity);
		Usuario usuario = toProto(guardado);
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

	@Override
	public void autenticarUsuario(LoginData request, StreamObserver<Usuario> responseObserver) {
		UsuarioEntity entity = usuarioRepository.findByNombreUsuarioAndActivoTrue(request.getNombreUsuario())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// TODO ver tema clave encriptada
		if (!request.getClave().equals(entity.getClave())) {
			responseObserver.onError(new RuntimeException("Credenciales incorrectas"));
			return;
		}

		Usuario usuario = toProto(entity);
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

}
