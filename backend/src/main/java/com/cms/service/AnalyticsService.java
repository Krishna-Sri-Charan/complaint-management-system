package com.cms.service;

import com.cms.dto.ComplaintAnalyticsResponse;
import com.cms.dto.DashboardStatsResponse;
import com.cms.model.ComplaintStatus;
import com.cms.repository.ComplaintRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    
    public ComplaintAnalyticsResponse
    getComplaintAnalytics() {

        long total =
                complaintRepository.count();

        long open =
                complaintRepository.countByStatus(
                        ComplaintStatus.OPEN
                );

        long inProgress =
                complaintRepository.countByStatus(
                        ComplaintStatus.IN_PROGRESS
                );

        long resolved =
                complaintRepository.countByStatus(
                        ComplaintStatus.RESOLVED
                );

        List<Object[]> monthlyData =
                complaintRepository
                        .getMonthlyComplaintStats();

        Map<String, Long> monthlyMap =
                new LinkedHashMap<>();

        String[] months = {
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
        };

        for (Object[] row : monthlyData) {

            Integer month =
                    (Integer) row[0];

            Long count =
                    (Long) row[1];

            monthlyMap.put(
                    months[month - 1],
                    count
            );
        }

        return ComplaintAnalyticsResponse
                .builder()

                .totalComplaints(total)

                .openComplaints(open)

                .inProgressComplaints(inProgress)

                .resolvedComplaints(resolved)

                .monthlyComplaints(monthlyMap)

                .build();
    }
}