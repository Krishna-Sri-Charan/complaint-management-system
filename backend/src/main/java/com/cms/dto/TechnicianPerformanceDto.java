package com.cms.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TechnicianPerformanceDto {

    private Long technicianId;

    private String technicianName;

    private long assignedComplaints;

    private long resolvedComplaints;

    private double completionRate;
}