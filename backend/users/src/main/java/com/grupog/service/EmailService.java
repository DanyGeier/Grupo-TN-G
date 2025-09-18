package com.grupog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    /**
     * Envía email de bienvenida a un nuevo usuario
     */
    public void envioEmailRegistro(String to, String nombreUsuario, String nombre, String password) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("�� ¡Bienvenido a Grupo TN-G!");

            // Procesar template Thymeleaf
            Context context = new Context();
            context.setVariable("nombreUsuario", nombreUsuario);
            context.setVariable("nombre", nombre);
            context.setVariable("password", password);

            // String htmlContent = templateEngine.process("mail-template", context);
            helper.setText("Te mando la password por ahora: " + password, true);

            mailSender.send(mimeMessage);
            System.out.println("Email de bienvenida enviado exitosamente a: " + to);
        } catch (Exception e) {
            System.err.println("Error enviando email de bienvenida a " + to + ": " + e.getMessage());
            // No lanzamos excepción para que el registro no falle si el email falla
        }
    }
}