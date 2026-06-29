package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.LoginRequest;
import com.cms.dto.LoginResponse;
import com.cms.dto.RegisterRequest;
import com.cms.model.User;
import com.cms.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ApiResponse<User> register(@Valid @RequestBody RegisterRequest request) {

    	User user = User.builder()
    	        .name(request.getName())
    	        .email(request.getEmail())
    	        .password(request.getPassword())
    	        .role(request.getRole())
    	        .specialization(request.getSpecialization())
    	        .failedAttempts(0)
    	        .accountLocked(false)
    	        .lockTime(null)
    	        .build();

        User savedUser = authService.register(user);

        return ApiResponse.<User>builder()
                .success(true)
                .message("User registered successfully")
                .data(savedUser)
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                authService.login(request);

        return ApiResponse.<LoginResponse>builder()

                .success(true)

                .message("Login successful")

                .data(response)

                .build();
    }
}