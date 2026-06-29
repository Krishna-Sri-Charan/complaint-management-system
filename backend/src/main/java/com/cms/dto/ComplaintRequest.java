package com.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100,
          message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 15, max = 1000,
          message = "Description must be between 15 and 1000 characters")
    private String description;

    @NotBlank(message = "Priority is required")
    private String userPriority;

    private String aiCategory;

    private String aiPriority;
}