package com.grupog.configs;

import io.grpc.Context;

/**
 * Clase para definir las claves de contexto compartidas entre interceptores y
 * servicios
 */
public class ContextKeys {

    /**
     * Clave para el token JWT en el contexto gRPC
     */
    public static final Context.Key<String> TOKEN_KEY = Context.key("token");

    private ContextKeys() {
        // Clase utilitaria, no instanciable
    }
}
