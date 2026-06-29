package com.cms.service;

import com.cms.model.User;
import com.cms.repository.UserRepository;
import com.cms.dto.LoginRequest;
import com.cms.dto.LoginResponse;
import com.cms.exception.AuthenticationException;
import com.cms.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    
    public LoginResponse login(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        request.getEmail()
                );

        if (optionalUser.isEmpty()) {

        	throw new AuthenticationException("Invalid credentials");
        }

        User user = optionalUser.get();

        if (user.isAccountLocked()) {

            if (user.getLockTime()
                    .plusMinutes(15)
                    .isAfter(LocalDateTime.now())) {

            	throw new AuthenticationException(
            		    "Account temporarily locked. Try again after 15 minutes."
            		);

            } else {

                user.setAccountLocked(false);
                user.setFailedAttempts(0);
                user.setLockTime(null);

                userRepository.save(user);
            }
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            int attempts =
                    user.getFailedAttempts() == null
                            ? 0
                            : user.getFailedAttempts();

            attempts++;

            user.setFailedAttempts(attempts);

            if (attempts >= 5) {

                user.setAccountLocked(true);

                user.setLockTime(
                        LocalDateTime.now()
                );
            }

            userRepository.save(user);

            if (user.isAccountLocked()) {

                throw new RuntimeException(
                        "Account temporarily locked. Try again after 15 minutes."
                );
            }

            throw new RuntimeException(
                    "Invalid credentials"
            );
        }

        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        user.setLockTime(null);

        userRepository.save(user);

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        return LoginResponse.builder()

                .id(user.getId())

                .name(user.getName())

                .email(user.getEmail())

                .role(user.getRole())
                
                .specialization(
                        user.getSpecialization()
                )

                .token(token)

                .build();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}