package com.cms.dto;

import lombok.*;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplaintAnalyticsResponse {

    private long totalComplaints;

    private long openComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    private Map<String, Long> monthlyComplaints;
}