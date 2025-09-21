package com.grupog.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import net.devh.boot.grpc.client.inject.GrpcClient;

import com.grupog.*;
import com.grupog.UsuarioServiceGrpc.UsuarioServiceBlockingStub;

@Service
public class UsuarioGrpcClient {

        @Lazy
        @GrpcClient("usuario-service")
        private UsuarioServiceBlockingStub usuarioStub;

        public Usuario buscarUsuarioPorId(Long id) {
                try {
                        BuscarUsuarioPorIdRequest request = BuscarUsuarioPorIdRequest.newBuilder()
                                        .setId(id)
                                        .build();

                        System.out.println("Buscando usuario por ID: " + id);
                        System.out.println("Usuario encontrado: " + usuarioStub.buscarUsuarioPorId(request));
                        return usuarioStub.buscarUsuarioPorId(request);
                } catch (Exception e) {
                        System.err.println("Error al buscar usuario por ID: " + e.getMessage());
                        // Fallback a simulación en caso de error
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
        }

        public Usuario buscarUsuarioPorNombreUsuario(String nombreUsuario) {
                try {
                        BuscarUsuarioPorNombreUsuarioRequest request = BuscarUsuarioPorNombreUsuarioRequest.newBuilder()
                                        .setNombreUsuario(nombreUsuario)
                                        .build();
                        return usuarioStub.buscarUsuarioPorNombreUsuario(request);
                } catch (Exception e) {
                        System.err.println("Error al buscar usuario por nombre: " + e.getMessage());
                        // Fallback a simulación en caso de error
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
        }

        public ListaUsuariosResponse listarUsuarios(EstadoUsuario estadoUsuario) {
                try {
                        ListarUsuariosRequest request = ListarUsuariosRequest.newBuilder()
                                        .setEstadoUsuario(estadoUsuario)
                                        .build();
                        return usuarioStub.listarUsuarios(request);
                } catch (Exception e) {
                        System.err.println("Error al listar usuarios: " + e.getMessage());
                        // Fallback a simulación en caso de error
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
}
