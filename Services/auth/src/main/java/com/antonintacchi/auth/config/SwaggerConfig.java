package com.antonintacchi.auth.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration Swagger / OpenAPI pour auth-service.
 * Accessible en développement : http://localhost:8090/swagger-ui/index.html
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI clapOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Clap! — Auth & Admin API")
                        .description("""
                                API de la plateforme **Clap!** — gestion de l'authentification,
                                des profils utilisateur et de l'administration.

                                Projet DWWM 2025-2026 · Antonin Tacchi
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Antonin Tacchi")
                                .email("antonin.tacchi2005@gmail.com"))
                        .license(new License().name("MIT")))
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT obtenu via POST /auth/login")));
    }
}
