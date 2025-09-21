package com.grupog.configs;

import io.grpc.*;
import org.springframework.stereotype.Component;

@Component
public class TokenExtractionInterceptor implements ServerInterceptor {

    private static final Metadata.Key<String> TOKEN_KEY = Metadata.Key.of("authorization",
            Metadata.ASCII_STRING_MARSHALLER);

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {

        // Log de inicio del interceptor
        System.out.println("[JWT INTERCEPTOR] Iniciando interceptación de llamada gRPC");
        System.out.println("[JWT INTERCEPTOR] Método: " + call.getMethodDescriptor().getFullMethodName());

        // Extraer token del header Authorization
        String token = headers.get(TOKEN_KEY);

        if (token != null) {
            System.out.println("[JWT INTERCEPTOR] Token encontrado en headers - Longitud: " + token.length());
            System.out.println("[JWT INTERCEPTOR] Token (primeros 50 chars): " +
                    (token.length() > 50 ? token.substring(0, 50) + "..." : token));
        } else {
            System.out.println("[JWT INTERCEPTOR] WARNING: No se encontró token en headers de autorización");
        }

        // Remover "Bearer " si está presente
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            System.out.println("[JWT INTERCEPTOR] Token procesado - Removido prefijo 'Bearer '");
            System.out.println("[JWT INTERCEPTOR] Token final (primeros 50 chars): " +
                    (token.length() > 50 ? token.substring(0, 50) + "..." : token));
        }

        // Agregar token al contexto
        Context context = Context.current().withValue(ContextKeys.TOKEN_KEY, token);
        System.out.println("[JWT INTERCEPTOR] Token agregado al contexto gRPC");
        System.out.println("[JWT INTERCEPTOR] Continuando con la llamada al servicio");

        return Contexts.interceptCall(context, call, headers, next);
    }
}
