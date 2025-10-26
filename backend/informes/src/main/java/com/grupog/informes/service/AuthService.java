/** 
package com.grupog.informes.service;

import java.nio.file.AccessDeniedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @GrpcCliente("usuario-service")
    private UsuarioServiceGrpc.UsuarioServiceBlockingStub usuarioStub;

    
     * Valida el token, llama al servicio de usuarios y devuelve el DTO
     
    public Usuario validarTokenYObtenerUsuario(String token) {
        if (!StringUtils.hasText(token) || !token.startsWith("Bearer ")) {
            throw new AccessDeniedException("Token no proporcionado o invalido");
        }

        String jwt = token.substring(7);

        if (!jwtService.validarTokenYObtenerUsuario(jwt)) {
            throw new AccessDeniedException("Token invalido o expirado");
        }

    

    }
    
}
*/