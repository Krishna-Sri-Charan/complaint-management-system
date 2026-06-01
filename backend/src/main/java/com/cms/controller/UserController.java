package com.cms.controller;

import java.security.Principal;

import com.cms.dto.ApiResponse;
import com.cms.dto.ChangePasswordRequest;
import com.cms.dto.ProfileUpdateRequest;
import com.cms.model.User;
import com.cms.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ApiResponse<User> getProfile(
            Principal principal
    ) {

        return ApiResponse
                .<User>builder()
                .success(true)
                .message("Profile fetched")
                .data(
                        userService.getProfile(
                                principal.getName()
                        )
                )
                .build();
    }

    @PutMapping("/profile")
    public ApiResponse<User> updateProfile(

            Principal principal,

            @RequestBody
            ProfileUpdateRequest request
    ) {

        return ApiResponse
                .<User>builder()
                .success(true)
                .message("Profile updated")
                .data(
                        userService.updateProfile(
                                principal.getName(),
                                request
                        )
                )
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(

            Principal principal,

            @RequestBody
            ChangePasswordRequest request
    ) {

        userService.changePassword(

                principal.getName(),
                request
        );

        return ApiResponse
                .<String>builder()
                .success(true)
                .message(
                        "Password changed successfully"
                )
                .data("Success")
                .build();
    }
}