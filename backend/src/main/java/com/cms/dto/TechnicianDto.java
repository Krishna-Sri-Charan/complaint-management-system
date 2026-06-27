package com.cms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TechnicianDto {

    private Long id;
    private String name;
    private String email;
    private String specialization;
}