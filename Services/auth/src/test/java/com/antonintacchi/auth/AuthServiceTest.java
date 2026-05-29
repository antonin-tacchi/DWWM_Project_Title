package com.antonintacchi.auth;

import com.antonintacchi.auth.client.DbUserClient;
import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.dto.LoginRequest;
import com.antonintacchi.auth.dto.RegisterRequest;
import com.antonintacchi.auth.mapper.UserMapper;
import com.antonintacchi.auth.model.UserModel;
import com.antonintacchi.auth.security.JwtUtil;
import com.antonintacchi.auth.service.AuthService;
import feign.FeignException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService — inscription et connexion")
class AuthServiceTest {

    @Mock private DbUserClient    dbUserClient;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil         jwtUtil;
    @Mock private UserMapper      userMapper;

    @InjectMocks
    private AuthService authService;

    /* ── Register ────────────────────────────────────────────────── */

    @Test
    @DisplayName("register — crée un utilisateur et retourne un token")
    void register_shouldCreateUserAndReturnToken() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@clap.fr");
        req.setUsername("newUser");
        req.setPassword("pass123");
        req.setConfirmPassword("pass123");

        UserModel saved = new UserModel();
        saved.setId(1L);
        saved.setEmail("new@clap.fr");
        saved.setRole("user");

        AuthResponse expected = new AuthResponse();
        expected.setEmail("new@clap.fr");

        when(dbUserClient.existsByEmail("new@clap.fr")).thenReturn(false);
        when(userMapper.toUser(req)).thenReturn(new UserModel());
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(dbUserClient.save(any())).thenReturn(saved);
        when(userMapper.toAuthResponse(saved)).thenReturn(expected);
        when(jwtUtil.generateToken(anyString(), anyLong(), anyString())).thenReturn("token123");

        AuthResponse result = authService.register(req);

        assertThat(result).isNotNull();
        assertThat(result.getToken()).isEqualTo("token123");
        verify(dbUserClient).save(any(UserModel.class));
    }

    @Test
    @DisplayName("register — lève une exception si l'email est déjà pris")
    void register_shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("taken@clap.fr");
        req.setPassword("pass");
        req.setConfirmPassword("pass");

        when(dbUserClient.existsByEmail("taken@clap.fr")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email already exists");

        verify(dbUserClient, never()).save(any());
    }

    @Test
    @DisplayName("register — lève une exception si les mots de passe ne correspondent pas")
    void register_shouldThrowWhenPasswordsMismatch() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("user@clap.fr");
        req.setPassword("pass1");
        req.setConfirmPassword("pass2");

        when(dbUserClient.existsByEmail(any())).thenReturn(false);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Passwords don't match");
    }

    /* ── Login ───────────────────────────────────────────────────── */

    @Test
    @DisplayName("login — retourne un token pour des identifiants valides")
    void login_shouldReturnTokenForValidCredentials() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("user@clap.fr");
        req.setPassword("correct");

        UserModel user = new UserModel();
        user.setId(1L);
        user.setEmail("user@clap.fr");
        user.setPasswordHash("hashed");
        user.setRole("user");

        AuthResponse expected = new AuthResponse();
        expected.setEmail("user@clap.fr");

        when(dbUserClient.findByEmail("user@clap.fr")).thenReturn(user);
        when(passwordEncoder.matches("correct", "hashed")).thenReturn(true);
        when(userMapper.toAuthResponse(user)).thenReturn(expected);
        when(jwtUtil.generateToken(anyString(), anyLong(), anyString())).thenReturn("jwt_token");

        AuthResponse result = authService.login(req);

        assertThat(result.getToken()).isEqualTo("jwt_token");
    }

    @Test
    @DisplayName("login — lève une exception si le mot de passe est incorrect")
    void login_shouldThrowWhenPasswordIsWrong() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("user@clap.fr");
        req.setPassword("wrong");

        UserModel user = new UserModel();
        user.setPasswordHash("hashed");

        when(dbUserClient.findByEmail("user@clap.fr")).thenReturn(user);
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Passwords don't match");
    }

    @Test
    @DisplayName("login — lève une exception si l'utilisateur n'existe pas")
    void login_shouldThrowWhenUserNotFound() {
        LoginRequest req = new LoginRequest();
        req.setIdentifier("unknown@clap.fr");
        req.setPassword("pass");

        when(dbUserClient.findByEmail("unknown@clap.fr"))
                .thenThrow(FeignException.NotFound.class);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}
