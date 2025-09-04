package com.grupog.grpc.service;

import com.examples.Grupo_TN_G.Usuario;
import com.grupog.entities.UsuarioEntity;

//import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UsuarioGrpcService {
	
	private Usuario toProto(UsuarioEntity e) {
		return Usuario.newBuilder()
				.setId(e.getIdUsuario())
				.setNombre(e.getUsername())
				.setEmail(e.getEmail())
				.build();
	}
	
}
