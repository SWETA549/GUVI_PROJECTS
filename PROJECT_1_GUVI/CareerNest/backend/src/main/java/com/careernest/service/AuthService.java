package com.careernest.service;

import com.careernest.dto.*;
import com.careernest.model.User;
import com.careernest.repository.UserRepository;
import com.careernest.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest request) {
        if (users.existsByEmail(request.email().toLowerCase())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().toLowerCase().trim())
                .password(encoder.encode(request.password()))
                .phone(request.phone().trim())
                .role(request.role())
                .build();
        users.save(user);
        return response(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return response(user);
    }

    private AuthResponse response(User user) {
        String token = jwt.generate(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getRole().name());
    }
}
