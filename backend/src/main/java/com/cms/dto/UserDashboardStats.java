package com.cms.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardStats {

    private long totalComplaints;

    private long openComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;
}