package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.User;
import com.antonintacchi.dbservice.repository.CommentRepository;
import com.antonintacchi.dbservice.repository.FavoriteRepository;
import com.antonintacchi.dbservice.repository.RatingRepository;
import com.antonintacchi.dbservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/users")
@RequiredArgsConstructor
public class UserController {

    private final RatingRepository   ratingRepository;
    private final CommentRepository  commentRepository;
    private final FavoriteRepository favoriteRepository;

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-email")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-username")
    public ResponseEntity<User> findByUsername(@RequestParam String username) {
        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exists/email")
    public ResponseEntity<Boolean> existsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userRepository.findByEmail(email).isPresent());
    }

    @PostMapping
    public ResponseEntity<User> save(@RequestBody User user) {
        user.setId(null); // force insert
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        user.setId(id);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** Ajoute de l'XP à l'utilisateur et recalcule le niveau (100 XP par niveau). */
    @PostMapping("/{id}/xp")
    public ResponseEntity<User> awardXp(@PathVariable Long id, @RequestParam int amount) {
        return userRepository.findById(id).map(user -> {
            int newXp    = (user.getXp() == null ? 0 : user.getXp()) + amount;
            int newLevel = 1 + newXp / 100;
            user.setXp(newXp);
            user.setLevel(newLevel);
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Recalcule l'XP depuis zéro en comptant toutes les actions existantes. */
    @PostMapping("/{id}/xp/recalculate")
    public ResponseEntity<User> recalculateXp(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            long ratings   = ratingRepository.countByUserId(id);
            long comments  = commentRepository.countByUserId(id);
            long favorites = favoriteRepository.findByUserId(id).size();
            int totalXp    = (int) (ratings * 5 + comments * 10 + favorites * 2);
            int newLevel   = 1 + totalXp / 100;
            user.setXp(totalXp);
            user.setLevel(newLevel);
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

}
