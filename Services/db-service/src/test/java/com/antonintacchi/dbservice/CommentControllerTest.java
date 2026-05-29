package com.antonintacchi.dbservice;

import com.antonintacchi.dbservice.controller.CommentController;
import com.antonintacchi.dbservice.entity.Comment;
import com.antonintacchi.dbservice.repository.CommentLikeRepository;
import com.antonintacchi.dbservice.repository.CommentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CommentController — CRUD commentaires")
class CommentControllerTest {

    @Mock private CommentRepository     commentRepository;
    @Mock private CommentLikeRepository commentLikeRepository;

    @InjectMocks
    private CommentController commentController;

    @Test
    @DisplayName("findAll — retourne tous les commentaires triés par date")
    void findAll_shouldReturnAllComments() {
        Comment c1 = new Comment(); c1.setId(1L); c1.setContent("Super film");
        Comment c2 = new Comment(); c2.setId(2L); c2.setContent("Bof bof");

        when(commentRepository.findAll(any(Sort.class))).thenReturn(List.of(c1, c2));

        ResponseEntity<List<Comment>> resp = commentController.findAll();

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).hasSize(2);
        assertThat(resp.getBody().get(0).getContent()).isEqualTo("Super film");
    }

    @Test
    @DisplayName("save — persiste un nouveau commentaire et réinitialise son id")
    void save_shouldPersistComment() {
        Comment incoming = new Comment(); incoming.setId(99L); incoming.setContent("Test");
        Comment saved   = new Comment(); saved.setId(1L);    saved.setContent("Test");

        when(commentRepository.save(any())).thenReturn(saved);

        ResponseEntity<Comment> resp = commentController.save(incoming);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getId()).isEqualTo(1L);
        // L'id doit être mis à null avant save()
        verify(commentRepository).save(argThat(c -> c.getId() == null));
    }

    @Test
    @DisplayName("delete — retourne 204 si le commentaire existe")
    void delete_shouldReturn204() {
        when(commentRepository.existsById(1L)).thenReturn(true);

        ResponseEntity<Void> resp = commentController.delete(1L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(commentRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete — retourne 404 si le commentaire n'existe pas")
    void delete_shouldReturn404WhenNotFound() {
        when(commentRepository.existsById(999L)).thenReturn(false);

        ResponseEntity<Void> resp = commentController.delete(999L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(commentRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("findById — retourne 404 pour un id inexistant")
    void findById_shouldReturn404WhenMissing() {
        when(commentRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Comment> resp = commentController.findById(42L);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
