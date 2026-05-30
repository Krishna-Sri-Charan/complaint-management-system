package com.cms.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TechnicianDashboardStats {

    private long assignedComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    private double completionRate;
}
