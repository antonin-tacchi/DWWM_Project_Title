package com.antonintacchi.auth;

import com.antonintacchi.auth.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtUtil — génération et validation des tokens")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    // Secret de test : au moins 32 bytes pour HS256
    private static final String TEST_SECRET =
            Base64.getEncoder().encodeToString(
                    "testSecretKeyForJWTTokenSigning12345".getBytes());

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret",     TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    @DisplayName("Génère un token valide et peut en extraire l'email")
    void generateToken_shouldContainEmail() {
        String token = jwtUtil.generateToken("test@clap.fr", 1L, "user");

        assertThat(token).isNotBlank();
        assertThat(jwtUtil.extractEmail(token)).isEqualTo("test@clap.fr");
    }

    @Test
    @DisplayName("Génère un token valide et peut en extraire l'userId")
    void generateToken_shouldContainUserId() {
        String token = jwtUtil.generateToken("test@clap.fr", 42L, "user");

        assertThat(jwtUtil.extractUserId(token)).isEqualTo(42L);
    }

    @Test
    @DisplayName("Génère un token admin avec le rôle correct")
    void generateToken_shouldContainRole() {
        String token = jwtUtil.generateToken("admin@clap.fr", 1L, "admin");

        assertThat(jwtUtil.extractRole(token)).isEqualTo("admin");
    }

    @Test
    @DisplayName("isValid retourne true pour un token valide")
    void isValid_shouldReturnTrueForValidToken() {
        String token = jwtUtil.generateToken("test@clap.fr", 1L, "user");

        assertThat(jwtUtil.isValid(token)).isTrue();
    }

    @Test
    @DisplayName("isValid retourne false pour un token malformé")
    void isValid_shouldReturnFalseForInvalidToken() {
        assertThat(jwtUtil.isValid("not.a.valid.jwt")).isFalse();
    }

    @Test
    @DisplayName("isValid retourne false pour un token vide")
    void isValid_shouldReturnFalseForEmptyToken() {
        assertThat(jwtUtil.isValid("")).isFalse();
    }
}
