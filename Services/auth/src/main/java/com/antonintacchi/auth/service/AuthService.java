package com.antonintacchi.auth.service;

import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.dto.LoginRequest;
import com.antonintacchi.auth.dto.RegisterRequest;
import com.antonintacchi.auth.dto.UpdateProfileRequest;
import com.antonintacchi.auth.entity.User;
import com.antonintacchi.auth.mapper.UserMapper;
import com.antonintacchi.auth.repository.UserRepository;
import com.antonintacchi.auth.security.JwtUtil;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
    }

    /**
     * Inscrit un nouvel utilisateur.
     * Vérifie que l'email n'existe pas déjà et que les mots de passe correspondent,
     * puis crée le compte, hashe le mot de passe et retourne un JWT.
     */
    public AuthResponse register(RegisterRequest request) {

        // 1. Vérifications
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        if (!request.getPassword().equals(request.getConfirmPassword()))
            throw new RuntimeException("Passwords don't match");

        // 2. Création de l'utilisateur
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // 3. Sauvegarde en BDD
        userRepository.save(user);

        // 4. Génération du token et réponse
        AuthResponse response = userMapper.toAuthResponse(user);
        response.setToken(jwtUtil.generateToken(user.getEmail()));

        return response;
    }

    /**
     * Connecte un utilisateur existant.
     * Accepte un email ou un username comme identifiant,
     * vérifie le mot de passe et retourne un JWT.
     */
    public AuthResponse login(LoginRequest request) {

        // 1. Recherche par email ou username selon si l'identifiant contient un @
        User user;
        if (request.getIdentifier().contains("@")){
            user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } else {
            user = userRepository.findByUsername(request.getIdentifier())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }

        // 2. Vérification du mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new RuntimeException("Passwords don't match");

        // 3. Génération du token et réponse
        AuthResponse response = userMapper.toAuthResponse(user);
        response.setToken(jwtUtil.generateToken(user.getEmail()));

        return response;
    }

    /**
     * Retourne le profil de l'utilisateur connecté.
     * L'email est extrait du JWT par la Gateway et transmis en paramètre.
     */
    public AuthResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toAuthResponse(user);

    }

    /**
     * Met à jour le profil de l'utilisateur connecté.
     * Seuls les champs envoyés dans la requête sont mis à jour.
     */
    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {

        // 1. Récupération de l'utilisateur
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Mise à jour des champs
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setBio(request.getBio());
        user.setLanguage(request.getLanguage());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setTheme(request.getTheme());
        user.setBannerTmdbId(request.getBannerTmdbId());

        // 3. Sauvegarde et réponse
        userRepository.save(user);
        return userMapper.toAuthResponse(user);
    }

    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepository.delete(user);
    }

}
