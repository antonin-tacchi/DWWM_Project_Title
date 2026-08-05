package com.antonintacchi.auth.controller;

import com.antonintacchi.auth.dto.*;
import com.antonintacchi.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request,
                                                 @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
                                                 HttpServletRequest httpRequest) {
        AuthResponse result = authService.register(request, resolveClientIp(forwardedFor, httpRequest));
        return ResponseEntity.status(201).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
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

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@RequestHeader("X-User-Email") String email, @RequestBody @Valid ChangePasswordRequest request) {
        authService.changePassword(email, request);
        return ResponseEntity.noContent().build();
    }

    private String resolveClientIp(String forwardedFor, HttpServletRequest httpRequest) {
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return httpRequest.getRemoteAddr();
    }

}
