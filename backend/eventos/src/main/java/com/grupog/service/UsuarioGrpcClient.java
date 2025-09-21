package com.grupog.service;

import org.springframework.stereotype.Service;

import com.grupog.*;

@Service
public class UsuarioGrpcClient {

    // TODO: Implementar cuando se resuelvan las dependencias gRPC
    // @GrpcClient("usuarios-service")
    // private UsuarioServiceBlockingStub usuarioStub;

    public Usuario buscarUsuarioPorId(Long id) {
        // TODO: Implementar llamada real al servicio de usuarios
        // BuscarUsuarioPorIdRequest request = BuscarUsuarioPorIdRequest.newBuilder()
        // .setId(id)
        // .build();
        // return usuarioStub.buscarUsuarioPorId(request);

        // Simulación temporal
        return Usuario.newBuilder()
                .setId(id)
                .setNombreUsuario("usuario" + id)
                .setNombre("Usuario")
                .setApellido("Temporal")
                .setTelefono("123456789")
                .setEmail("usuario" + id + "@example.com")
                .setRol(Rol.VOLUNTARIO)
                .setFechaCreacion(System.currentTimeMillis())
                .setEstado(EstadoUsuario.ACTIVO)
                .build();
    }

    public Usuario buscarUsuarioPorNombreUsuario(String nombreUsuario) {
        // TODO: Implementar llamada real al servicio de usuarios
        // return usuarioStub.buscarUsuarioPorNombreUsuario(nombreUsuario);

        // Simulación temporal
        return Usuario.newBuilder()
                .setId(1L)
                .setNombreUsuario(nombreUsuario)
                .setNombre("Usuario")
                .setApellido("Temporal")
                .setTelefono("123456789")
                .setEmail(nombreUsuario + "@example.com")
                .setRol(Rol.PRESIDENTE)
                .setFechaCreacion(System.currentTimeMillis())
                .setEstado(EstadoUsuario.ACTIVO)
                .build();
    }

    public ListaUsuariosResponse listarUsuarios(EstadoUsuario estadoUsuario) {
        // TODO: Implementar llamada real al servicio de usuarios
        // ListarUsuariosRequest request = ListarUsuariosRequest.newBuilder()
        // .setEstadoUsuario(estadoUsuario)
        // .build();
        // return usuarioStub.listarUsuarios(request);

        // Simulación temporal
        Usuario usuario1 = Usuario.newBuilder()
                .setId(1L)
                .setNombreUsuario("admin")
                .setNombre("Administrador")
                .setApellido("Sistema")
                .setTelefono("123456789")
                .setEmail("admin@example.com")
                .setRol(Rol.PRESIDENTE)
                .setFechaCreacion(System.currentTimeMillis())
                .setEstado(EstadoUsuario.ACTIVO)
                .build();

        Usuario usuario2 = Usuario.newBuilder()
                .setId(2L)
                .setNombreUsuario("voluntario1")
                .setNombre("Voluntario")
                .setApellido("Uno")
                .setTelefono("987654321")
                .setEmail("voluntario1@example.com")
                .setRol(Rol.VOLUNTARIO)
                .setFechaCreacion(System.currentTimeMillis())
                .setEstado(EstadoUsuario.ACTIVO)
                .build();

        return ListaUsuariosResponse.newBuilder()
                .addUsuarios(usuario1)
                .addUsuarios(usuario2)
                .build();
    }
}
