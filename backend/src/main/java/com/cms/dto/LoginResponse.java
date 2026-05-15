package com.cms.dto;

import com.cms.model.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;
}