package com.cms.service;

import com.cms.dto.DashboardStatsResponse;
import com.cms.model.ComplaintStatus;
import com.cms.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public DashboardStatsResponse getDashboardStats() {

        long total = complaintRepository.count();

        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);

        long pending =
                complaintRepository.countByStatus(ComplaintStatus.OPEN)
              + complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);

        return DashboardStatsResponse.builder()
                .totalComplaints(total)
                .resolvedComplaints(resolved)
                .pendingComplaints(pending)
                .build();
    }
}