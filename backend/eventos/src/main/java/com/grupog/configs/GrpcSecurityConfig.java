package com.grupog.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;
import net.devh.boot.grpc.server.security.authentication.BasicGrpcAuthenticationReader;
import net.devh.boot.grpc.server.security.authentication.GrpcAuthenticationReader;

import com.grupog.configs.TokenExtractionInterceptor;

@Configuration
public class GrpcSecurityConfig {

    @GrpcGlobalServerInterceptor
    public TokenExtractionInterceptor tokenExtractionInterceptor() {
        return new TokenExtractionInterceptor();
    }
}
