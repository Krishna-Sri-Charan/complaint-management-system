package com.cms.service;

import com.cms.dto.ChangePasswordRequest;
import com.cms.dto.ProfileUpdateRequest;
import com.cms.exception.ResourceNotFoundException;
import com.cms.model.User;
import com.cms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getProfile(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    public User updateProfile(
            String email,
            ProfileUpdateRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        return userRepository.save(user);
    }

    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        boolean matches =
                passwordEncoder.matches(
                        request.getOldPassword(),
                        user.getPassword()
                );

        if (!matches) {

            throw new RuntimeException(
                    "Old password is incorrect"
            );
        }

        user.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }
}