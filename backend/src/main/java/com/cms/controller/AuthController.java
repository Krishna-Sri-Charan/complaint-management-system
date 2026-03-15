package com.cms.controller;

import com.cms.dto.LoginRequest;
import com.cms.dto.RegisterRequest;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .build();

        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        Optional<User> user = authService.findByEmail(request.getEmail());

        if (user.isPresent() &&
                user.get().getPassword().equals(request.getPassword())) {

            return "Login Successful";
        }

        return "Invalid Credentials";
    }
}