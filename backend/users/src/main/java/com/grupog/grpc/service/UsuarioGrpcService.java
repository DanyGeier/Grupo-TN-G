package com.grupog.grpc.service;

import java.util.stream.Collectors;

import com.grupog.ListaUsuariosResponse;
import com.grupog.ListarUsuariosRequest;
import com.grupog.Usuario;
import com.grupog.UsuarioServiceGrpc.UsuarioServiceImplBase;
import com.grupog.entities.UsuarioEntity;
import com.grupog.repositories.UsuarioRepository;

import io.grpc.stub.StreamObserver;
//import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UsuarioGrpcService extends UsuarioServiceImplBase {

	private final UsuarioRepository usuarioRepository;

	public UsuarioGrpcService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	private Usuario toProto(UsuarioEntity e) {
		return Usuario.newBuilder()
				.setId(e.getIdUsuario())
				.setNombre(e.getUsername())
				.setEmail(e.getEmail())
				.build();
	}

	@Override
	public void listarUsuarios(ListarUsuariosRequest request, StreamObserver<ListaUsuariosResponse> responseObserver) {
		Usuario usuario = usuarioRepository.findAll()
				.stream()
				.map(this::toProto).collect(Collectors.toList()).get(0);
		ListaUsuariosResponse response = ListaUsuariosResponse.newBuilder().addUsuarios(usuario).build();
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}
}
