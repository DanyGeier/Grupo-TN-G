package com.grupog.configs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.grupog.entities.RolEntity;
import com.grupog.entities.UsuarioEntity;
import com.grupog.repositories.RolRepository;
import com.grupog.repositories.UsuarioRepository;

import java.time.Instant;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, RolRepository rolRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Crear roles si no existen
        crearRolSiNoExiste("PRESIDENTE");
        crearRolSiNoExiste("VOCAL");
        crearRolSiNoExiste("COORDINADOR");
        crearRolSiNoExiste("VOLUNTARIO");

        // Crear usuario admin si no existe
        if (!usuarioRepository.existsByNombreUsuario("admin")) {
            RolEntity rolPresidente = rolRepository.findByNombreRol("PRESIDENTE")
                    .orElseThrow(() -> new RuntimeException("Rol PRESIDENTE no encontrado"));

            UsuarioEntity admin = new UsuarioEntity();
            admin.setNombreUsuario("admin");
            admin.setNombre("Administrador");
            admin.setApellido("Sistema");
            admin.setEmail("admin@grupo.com");
            admin.setTelefono("123456789");
            admin.setClave(passwordEncoder.encode("admin123"));
            admin.setRol(rolPresidente);
            admin.setActivo(true);
            admin.setFechaCreacion(Instant.now());

            usuarioRepository.save(admin);

            System.out.println("✅ Usuario admin creado exitosamente");
            System.out.println("   Usuario: admin");
            System.out.println("   Contraseña: admin123");
            System.out.println("   Rol: PRESIDENTE");
        } else {
            System.out.println("ℹ️  Usuario admin ya existe, saltando creación");
        }
    }

    private void crearRolSiNoExiste(String nombreRol) {
        if (!rolRepository.existsByNombreRol(nombreRol)) {
            RolEntity rol = new RolEntity();
            rol.setNombreRol(nombreRol);
            rolRepository.save(rol);
            System.out.println("✅ Rol creado: " + nombreRol);
        }
    }
}
