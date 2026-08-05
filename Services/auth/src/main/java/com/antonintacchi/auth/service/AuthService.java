package com.antonintacchi.auth.service;

import com.antonintacchi.auth.client.DbUserClient;
import com.antonintacchi.auth.dto.*;
import com.antonintacchi.auth.mapper.UserMapper;
import com.antonintacchi.auth.model.UserModel;
import com.antonintacchi.auth.security.JwtUtil;
import feign.FeignException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final DbUserClient    dbUserClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;
    private final UserMapper      userMapper;
    private final TurnstileService turnstileService;

    public AuthService(DbUserClient dbUserClient, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, UserMapper userMapper, TurnstileService turnstileService) {
        this.dbUserClient    = dbUserClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
        this.userMapper      = userMapper;
        this.turnstileService = turnstileService;
    }

    /**
     * Inscrit un nouvel utilisateur.
     */
    public AuthResponse register(RegisterRequest request) {
        return register(request, null);
    }

    public AuthResponse register(RegisterRequest request, String remoteIp) {

        turnstileService.validateRegistrationToken(request.getTurnstileToken(), remoteIp);

        // Vérification : email déjà pris ?
        if (Boolean.TRUE.equals(dbUserClient.existsByEmail(request.getEmail()))) {
            throw new RuntimeException("Email already exists");
        }

        // Vérification : mots de passe correspondent ?
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        // Création du modèle utilisateur
        UserModel user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Sauvegarde via db-service
        UserModel saved = dbUserClient.save(user);

        // Génération du token et réponse
        AuthResponse response = userMapper.toAuthResponse(saved);
        response.setToken(jwtUtil.generateToken(saved.getEmail(), saved.getId(), saved.getRole()));

        return response;
    }

    /**
     * Connecte un utilisateur existant.
     */
    public AuthResponse login(LoginRequest request) {

        // Recherche par email ou username
        UserModel user;
        try {
            if (request.getIdentifier().contains("@")) {
                user = dbUserClient.findByEmail(request.getIdentifier());
            } else {
                user = dbUserClient.findByUsername(request.getIdentifier());
            }
        } catch (FeignException.NotFound e) {
            throw new UsernameNotFoundException("User not found");
        }

        // Vérification du mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Passwords don't match");
        }

        // Génération du token et réponse
        AuthResponse response = userMapper.toAuthResponse(user);
        response.setToken(jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole()));

        return response;
    }

    /**
     * Retourne le profil de l'utilisateur connecté.
     */
    public AuthResponse getProfile(String email) {
        UserModel user = findByEmailOrThrow(email);
        return userMapper.toAuthResponse(user);
    }

    /**
     * Met à jour le profil de l'utilisateur connecté.
     */
    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        UserModel user = findByEmailOrThrow(email);

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setBio(request.getBio());
        user.setLanguage(request.getLanguage());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setTheme(request.getTheme());
        user.setBannerTmdbId(request.getBannerTmdbId());
        if (request.getBannerMediaType() != null) {
            user.setBannerMediaType(request.getBannerMediaType());
        }
        user.setBannerBackdropPath(request.getBannerBackdropPath());

        UserModel updated = dbUserClient.update(user.getId(), user);
        return userMapper.toAuthResponse(updated);
    }

    public void deleteAccount(String email) {
        UserModel user = findByEmailOrThrow(email);
        dbUserClient.delete(user.getId());
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        UserModel user = findByEmailOrThrow(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Wrong current password");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        dbUserClient.update(user.getId(), user);
    }

    /* ── Helpers ─────────────────────────────────────────────────── */

    private UserModel findByEmailOrThrow(String email) {
        try {
            return dbUserClient.findByEmail(email);
        } catch (FeignException.NotFound e) {
            throw new UsernameNotFoundException("User not found");
        }
    }

}
