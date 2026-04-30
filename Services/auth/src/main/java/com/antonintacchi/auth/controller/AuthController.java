package com.antonintacchi.auth.controller;

import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.dto.LoginRequest;
import com.antonintacchi.auth.dto.RegisterRequest;
import com.antonintacchi.auth.dto.UpdateProfileRequest;
import com.antonintacchi.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse result = authService.register(request);
        return ResponseEntity.status(201).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse result = authService.login(request);
        return ResponseEntity.status(200).body(result);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getProfile(@RequestHeader("X-User-Email") String email) {
        AuthResponse result = authService.getProfile(email);
        return ResponseEntity.status(200).body(result);
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateProfile(@RequestHeader("X-User-Email")  String email, @RequestBody UpdateProfileRequest request) {
        AuthResponse result = authService.updateProfile(email, request);
        return ResponseEntity.status(200).body(result);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteProfile(@RequestHeader("X-User-Email")  String email) {
        authService.deleteAccount(email);
        return ResponseEntity.noContent().build();
    }

}
