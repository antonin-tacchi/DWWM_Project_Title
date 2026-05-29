package com.antonintacchi.dbservice;

import com.antonintacchi.dbservice.controller.RatingController;
import com.antonintacchi.dbservice.entity.Rating;
import com.antonintacchi.dbservice.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RatingController — CRUD notes")
class RatingControllerTest {

    @Mock private RatingRepository ratingRepository;

    @InjectMocks
    private RatingController ratingController;

    @Test
    @DisplayName("save — persiste une nouvelle note avec id null")
    void save_shouldPersistRating() {
        Rating incoming = new Rating(); incoming.setId(5L); incoming.setScore((byte) 8);
        Rating saved   = new Rating(); saved.setId(1L);   saved.setScore((byte) 8);

        when(ratingRepository.save(any())).thenReturn(saved);

        ResponseEntity<Rating> resp = ratingController.save(incoming);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getScore()).isEqualTo((byte) 8);
        verify(ratingRepository).save(argThat(r -> r.getId() == null));
    }

    @Test
    @DisplayName("delete — supprime la note et retourne 204")
    void delete_shouldReturn204() {
        when(ratingRepository.existsById(1L)).thenReturn(true);

        ResponseEntity<Void> resp = ratingController.delete(1L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(ratingRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete — retourne 404 si la note n'existe pas")
    void delete_shouldReturn404WhenNotFound() {
        when(ratingRepository.existsById(anyLong())).thenReturn(false);

        ResponseEntity<Void> resp = ratingController.delete(99L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("exists — retourne true si la note existe")
    void exists_shouldReturnTrue() {
        when(ratingRepository.existsByUserIdAndTmdbIdAndMediaType(1L, 100L, "movie")).thenReturn(true);

        ResponseEntity<Boolean> resp = ratingController.exists(1L, 100L, "movie");

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isTrue();
    }

    @Test
    @DisplayName("findById — retourne 404 si la note n'existe pas")
    void findById_shouldReturn404WhenMissing() {
        when(ratingRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Rating> resp = ratingController.findById(99L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
