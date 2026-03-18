package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.LoginRequest;
import com.cms.dto.RegisterRequest;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/register")
    public ApiResponse<User> register(@Valid @RequestBody RegisterRequest request) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole())
                .build();

        User savedUser = authService.register(user);

        return ApiResponse.<User>builder()
                .success(true)
                .message("User registered successfully")
                .data(savedUser)
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<String> login(@Valid @RequestBody LoginRequest request) {

        Optional<User> user = authService.findByEmail(request.getEmail());

        if (user.isPresent() &&
                passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {

            return ApiResponse.<String>builder()
                    .success(true)
                    .message("Login successful")
                    .data("SUCCESS")
                    .build();
        }

        return ApiResponse.<String>builder()
                .success(false)
                .message("Invalid credentials")
                .data(null)
                .build();
    }
}