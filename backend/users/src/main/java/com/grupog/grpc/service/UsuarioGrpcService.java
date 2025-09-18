package com.grupog.grpc.service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.grupog.ActualizarUsuarioRequest;
import com.grupog.BuscarUsuarioPorIdRequest;
import com.grupog.CrearUsuarioRequest;
import com.grupog.EstadoUsuario;
import com.grupog.ListaUsuariosResponse;
import com.grupog.ListarUsuariosRequest;
import com.grupog.LoginRequest;
import com.grupog.Rol;
import com.grupog.Usuario;
import com.grupog.UsuarioServiceGrpc.UsuarioServiceImplBase;
import com.grupog.entities.RolEntity;
import com.grupog.entities.UsuarioEntity;
import com.grupog.mappers.UsuarioMapper;
import com.grupog.RespuestaExito;
import com.grupog.repositories.RolRepository;
import com.grupog.repositories.UsuarioRepository;
import com.grupog.utils.PasswordGenerator;

import io.grpc.Status;
import io.grpc.stub.StreamObserver;
//import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UsuarioGrpcService extends UsuarioServiceImplBase {

	private final UsuarioRepository usuarioRepository;
	private final RolRepository rolRepository;
	private final UsuarioMapper usuarioMapper;
	private final PasswordEncoder passwordEncoder;

	public UsuarioGrpcService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
			PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.rolRepository = rolRepository;
		this.usuarioMapper = new UsuarioMapper(rolRepository);
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void listarUsuarios(ListarUsuariosRequest request, StreamObserver<ListaUsuariosResponse> responseObserver) {
		List<Usuario> usuarios = usuarioRepository.findAll()
				.stream()
				.map(this.usuarioMapper::toProto).collect(Collectors.toList());
		ListaUsuariosResponse response = ListaUsuariosResponse.newBuilder().addAllUsuarios(usuarios).build();
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

	@Override
	public void registrarUsuario(CrearUsuarioRequest request, StreamObserver<Usuario> responseObserver) {
		System.out.println("Registrando usuario: " + request.getNombreUsuario());

		if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
			responseObserver.onError(Status.ALREADY_EXISTS
					.withDescription("El nombre de usuario '" + request.getNombreUsuario() + "' ya existe")
					.asRuntimeException());

			return;
		}
		if (usuarioRepository.existsByEmail(request.getEmail())) {
			responseObserver.onError(Status.ALREADY_EXISTS
					.withDescription("El email '" + request.getEmail() + "' ya existe")
					.asRuntimeException());

			return;
		}

		UsuarioEntity entity = usuarioMapper.toEntity(request);

		String password = "changeme";// PasswordGenerator.generarPassword();

		entity.setClave(passwordEncoder.encode(password));
		System.out.println("Guardando usuario: " + entity.getNombreUsuario());
		UsuarioEntity guardado = usuarioRepository.save(entity);
		Usuario usuario = usuarioMapper.toProto(guardado);
		System.out.println("Usuario guardado: " + usuario.getNombreUsuario());
		// Envio de email con el password
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

	@Override
	public void buscarUsuarioPorId(BuscarUsuarioPorIdRequest request, StreamObserver<Usuario> responseObserver) {
		UsuarioEntity entity = usuarioRepository.findById(request.getId())
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		Usuario usuario = usuarioMapper.toProto(entity);
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
		entity.setRol(usuarioMapper.mapRolProtoToEntity(request.getRol()));
		entity.setActivo(request.getEstado() == EstadoUsuario.ACTIVO);

		UsuarioEntity guardado = usuarioRepository.save(entity);
		Usuario usuario = usuarioMapper.toProto(guardado);
		responseObserver.onNext(usuario);
		responseObserver.onCompleted();
	}

}
