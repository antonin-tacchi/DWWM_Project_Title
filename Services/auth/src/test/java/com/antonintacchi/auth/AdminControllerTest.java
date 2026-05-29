package com.antonintacchi.auth;

import com.antonintacchi.auth.client.DbAdminLogClient;
import com.antonintacchi.auth.client.DbCommentAdminClient;
import com.antonintacchi.auth.client.DbRatingAdminClient;
import com.antonintacchi.auth.client.DbStatsClient;
import com.antonintacchi.auth.client.DbUserClient;
import com.antonintacchi.auth.controller.AdminController;
import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.mapper.UserMapper;
import com.antonintacchi.auth.model.UserModel;
import feign.FeignException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminController — gestion des utilisateurs")
class AdminControllerTest {

    @Mock private DbUserClient         dbUserClient;
    @Mock private DbStatsClient        dbStatsClient;
    @Mock private DbCommentAdminClient dbCommentAdminClient;
    @Mock private DbRatingAdminClient  dbRatingAdminClient;
    @Mock private DbAdminLogClient     dbAdminLogClient;
    @Mock private UserMapper           userMapper;

    @InjectMocks
    private AdminController adminController;

    @Test
    @DisplayName("getAllUsers — retourne la liste de tous les utilisateurs")
    void getAllUsers_shouldReturnUserList() {
        UserModel u1 = new UserModel(); u1.setId(1L); u1.setEmail("a@clap.fr");
        UserModel u2 = new UserModel(); u2.setId(2L); u2.setEmail("b@clap.fr");

        AuthResponse r1 = new AuthResponse(); r1.setEmail("a@clap.fr");
        AuthResponse r2 = new AuthResponse(); r2.setEmail("b@clap.fr");

        when(dbUserClient.findAll()).thenReturn(List.of(u1, u2));
        when(userMapper.toAuthResponse(u1)).thenReturn(r1);
        when(userMapper.toAuthResponse(u2)).thenReturn(r2);

        ResponseEntity<List<AuthResponse>> resp = adminController.getAllUsers();

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).hasSize(2);
    }

    @Test
    @DisplayName("deleteUser — retourne 204 No Content après suppression")
    void deleteUser_shouldReturn204() {
        UserModel user = new UserModel(); user.setId(1L); user.setUsername("CapitainLicorne");
        user.setEmail("cap@clap.fr");

        when(dbUserClient.findById(1L)).thenReturn(user);
        when(dbAdminLogClient.save(any())).thenReturn(Map.of());

        ResponseEntity<Void> resp = adminController.deleteUser(1L, 99L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(dbUserClient).delete(1L);
    }

    @Test
    @DisplayName("deleteUser — retourne 404 si l'utilisateur n'existe pas")
    void deleteUser_shouldReturn404WhenNotFound() {
        when(dbUserClient.findById(anyLong())).thenThrow(FeignException.NotFound.class);

        ResponseEntity<Void> resp = adminController.deleteUser(999L, 1L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(dbUserClient, never()).delete(any());
    }

    @Test
    @DisplayName("getStats — retourne les statistiques de la plateforme")
    void getStats_shouldReturnPlatformStats() {
        Map<String, Long> stats = Map.of("users", 5L, "comments", 12L);
        when(dbStatsClient.getStats()).thenReturn(stats);

        ResponseEntity<Map<String, Long>> resp = adminController.getStats();

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).containsEntry("users", 5L);
    }
}
