package com.grupog.configs;

import io.grpc.*;
import org.springframework.stereotype.Component;

@Component
public class TokenExtractionInterceptor implements ServerInterceptor {

    private static final Metadata.Key<String> TOKEN_KEY = Metadata.Key.of("authorization",
            Metadata.ASCII_STRING_MARSHALLER);
    private static final Context.Key<String> TOKEN_CONTEXT_KEY = Context.key("token");

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {

        // Extraer token del header Authorization
        String token = headers.get(TOKEN_KEY);

        System.out.println("Token interceptado: " + token);

        // Remover "Bearer " si está presente
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Agregar token al contexto
        Context context = Context.current().withValue(TOKEN_CONTEXT_KEY, token);

        return Contexts.interceptCall(context, call, headers, next);
    }
}
