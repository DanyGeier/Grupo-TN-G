package com.grupog.grpc.service;

import com.grupog.ListaUsuariosResponse;
import com.grupog.ListarUsuariosRequest;
import com.grupog.Usuario;
import com.grupog.UsuarioServiceGrpc.UsuarioServiceImplBase;
import com.grupog.entities.UsuarioEntity;

import io.grpc.stub.StreamObserver;
//import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UsuarioGrpcService extends UsuarioServiceImplBase{
	
	private Usuario toProto(UsuarioEntity e) {
		return Usuario.newBuilder()
				.setId(e.getIdUsuario())
				.setNombre(e.getUsername())
				.setEmail(e.getEmail())
				.build();
	}
	
	@Override
	public void listarUsuarios(ListarUsuariosRequest request, StreamObserver<ListaUsuariosResponse> responseObserver) {
		ListaUsuariosResponse response = ListaUsuariosResponse.newBuilder().build();
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}
}
