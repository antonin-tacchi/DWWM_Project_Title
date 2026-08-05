package com.antonintacchi.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Smoke test : vérifie que le contexte Spring démarre correctement.
 * Les propriétés sensibles (JWT_SECRET, JWT_EXPIRATION) sont surchargées
 * avec des valeurs de test pour éviter de dépendre des variables d'environnement Docker.
 */
@SpringBootTest
@TestPropertySource(properties = {
    "JWT_SECRET=dGVzdFNlY3JldEtleUZvckpXVFRva2VuU2lnbmluZzEyMzQ1",
    "JWT_EXPIRATION=86400000",
    "TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA"
})
class AuthApplicationTests {

    @Test
    void contextLoads() {
        // Vérifie que le contexte Spring démarre sans erreur
    }

}
