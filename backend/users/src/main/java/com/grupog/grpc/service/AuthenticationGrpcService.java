package com.grupog.grpc.service;

import net.devh.boot.grpc.server.service.GrpcService;
import com.grupog.AuthenticationServiceGrpc.AuthenticationServiceImplBase;
import com.grupog.LoginRequest;
import com.grupog.LoginResponse;
import com.grupog.LogoutRequest;
import com.grupog.LogoutResponse;
import com.grupog.Usuario;
import com.grupog.entities.UsuarioEntity;
import com.grupog.mappers.UsuarioMapper;
import com.grupog.repositories.RolRepository;
import com.grupog.repositories.UsuarioRepository;

import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

@GrpcService
public class AuthenticationGrpcService extends AuthenticationServiceImplBase {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UsuarioMapper usuarioMapper;
    private final RolRepository rolRepository;

    public AuthenticationGrpcService(UsuarioRepository usuarioRepository, AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder, JwtService jwtService, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.rolRepository = rolRepository;
        this.usuarioMapper = new UsuarioMapper(rolRepository);
    }

    @Override
    public void login(LoginRequest request, StreamObserver<LoginResponse> responseObserver) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNombreUsuario(), request.getClave()));

        if (!authentication.isAuthenticated()) {
            responseObserver.onError(new StatusRuntimeException(Status.UNAUTHENTICATED));
            return;
        }
        Optional<UsuarioEntity> usuario = usuarioRepository
                .findByNombreUsuarioAndActivoTrue(request.getNombreUsuario());

        String jwtToken = jwtService.generateToken(usuario.get());

        LoginResponse response = LoginResponse.newBuilder()
                .setUsuario(usuarioMapper.toProto(usuario.get()))
                .setToken(jwtToken)
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void logout(LogoutRequest request, StreamObserver<LogoutResponse> responseObserver) {
        super.logout(request, responseObserver);
    }
}
