package com.antonintacchi.gateway;

import com.antonintacchi.gateway.security.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Gateway JwtUtil — extraction des claims")
class JwtUtilGatewayTest {

    private JwtUtil jwtUtil;

    private static final String TEST_SECRET =
            Base64.getEncoder().encodeToString(
                    "testSecretKeyForJWTTokenSigning12345".getBytes());

    private String validAdminToken;
    private String validTokenNoRole;

    /** Génère un JWT signé directement avec jjwt — sans dépendance vers auth-service. */
    private String buildToken(String email, Long userId, String role) {
        byte[] keyBytes = Base64.getDecoder().decode(TEST_SECRET);
        Key key = Keys.hmacShaKeyFor(keyBytes);

        var builder = Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86_400_000L))
                .signWith(key);

        if (role != null) {
            builder.claim("role", role);
        }
        return builder.compact();
    }

    @BeforeEach
    void setUp() {
        validAdminToken  = buildToken("admin@clap.fr", 1L, "admin");
        validTokenNoRole = buildToken("user@clap.fr",  2L, null);

        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
    }

    @Test
    @DisplayName("isValid — retourne true pour un token valide")
    void isValid_shouldReturnTrueForValidToken() {
        assertThat(jwtUtil.isValid(validAdminToken)).isTrue();
    }

    @Test
    @DisplayName("isValid — retourne false pour un token malformé")
    void isValid_shouldReturnFalseForMalformedToken() {
        assertThat(jwtUtil.isValid("invalid.token.value")).isFalse();
    }

    @Test
    @DisplayName("extractEmail — retourne l'email du token")
    void extractEmail_shouldReturnEmail() {
        assertThat(jwtUtil.extractEmail(validAdminToken)).isEqualTo("admin@clap.fr");
    }

    @Test
    @DisplayName("extractUserId — retourne l'userId du token")
    void extractUserId_shouldReturnUserId() {
        assertThat(jwtUtil.extractUserId(validAdminToken)).isEqualTo(1L);
    }

    @Test
    @DisplayName("extractRole — retourne 'admin' pour un token admin")
    void extractRole_shouldReturnAdminRole() {
        assertThat(jwtUtil.extractRole(validAdminToken)).isEqualTo("admin");
    }

    @Test
    @DisplayName("extractRole — retourne 'user' par défaut si claim absent")
    void extractRole_shouldDefaultToUserWhenClaimMissing() {
        assertThat(jwtUtil.extractRole(validTokenNoRole)).isEqualTo("user");
    }
}
