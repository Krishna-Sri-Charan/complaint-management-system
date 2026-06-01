package com.cms.service;

import com.cms.dto.ComplaintAnalyticsResponse;
import com.cms.dto.DashboardStatsResponse;
import com.cms.dto.TechnicianDashboardStats;
import com.cms.dto.TechnicianPerformanceDto;
import com.cms.dto.UserDashboardStats;
import com.cms.exception.ResourceNotFoundException;
import com.cms.model.Complaint;
import com.cms.model.ComplaintStatus;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.repository.ComplaintRepository;
import com.cms.repository.UserRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private ComplaintRepository complaintRepository;
    
    @Autowired
    private UserRepository userRepository;

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
    
    public ComplaintAnalyticsResponse getComplaintAnalytics() {

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
        
        List<Complaint> resolvedComplaints =
                complaintRepository.findByStatus(
                        ComplaintStatus.RESOLVED
                );
        
        double average = 0;
        double fastest = 0;
        double slowest = 0;

        if(!resolvedComplaints.isEmpty()) {

            List<Double> hours =
                    resolvedComplaints.stream()

                    .filter(c ->
                            c.getResolvedAt() != null
                    )

                    .map(c -> {

                        long minutes =

                                Duration.between(

                                        c.getCreatedAt(),

                                        c.getResolvedAt()

                                ).toMinutes();

                        return minutes / 60.0;

                    })

                    .toList();

            average =
                    hours.stream()

                            .mapToDouble(Double::doubleValue)

                            .average()

                            .orElse(0);

            fastest =
                    hours.stream()

                            .mapToDouble(Double::doubleValue)

                            .min()

                            .orElse(0);

            slowest =
                    hours.stream()

                            .mapToDouble(Double::doubleValue)

                            .max()

                            .orElse(0);
        }

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
                
                .averageResolutionHours(average)

                .fastestResolutionHours(fastest)

                .slowestResolutionHours(slowest)

                .build();
    }
    
    public UserDashboardStats getUserDashboardStats(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return UserDashboardStats.builder()

                .totalComplaints(
                        complaintRepository.countByUserId(
                                user.getId()
                        )
                )

                .openComplaints(
                        complaintRepository
                                .countByUserIdAndStatus(
                                        user.getId(),
                                        ComplaintStatus.OPEN
                                )
                )

                .inProgressComplaints(
                        complaintRepository
                                .countByUserIdAndStatus(
                                        user.getId(),
                                        ComplaintStatus.IN_PROGRESS
                                )
                )

                .resolvedComplaints(
                        complaintRepository
                                .countByUserIdAndStatus(
                                        user.getId(),
                                        ComplaintStatus.RESOLVED
                                )
                )

                .build();
    }
    
    public TechnicianDashboardStats getTechnicianDashboardStats(
            String email
    ) {

        User technician =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        long assigned =
                complaintRepository
                        .countByTechnicianId(
                                technician.getId()
                        );

        long inProgress =
                complaintRepository
                        .countByTechnicianIdAndStatus(
                                technician.getId(),
                                ComplaintStatus.IN_PROGRESS
                        );

        long resolved =
                complaintRepository
                        .countByTechnicianIdAndStatus(
                                technician.getId(),
                                ComplaintStatus.RESOLVED
                        );

        double completionRate = assigned == 0
                ? 0
                : (resolved * 100.0) / assigned;

        return TechnicianDashboardStats
                .builder()
                .assignedComplaints(assigned)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .completionRate(completionRate)
                .build();
    }
    
    public List<TechnicianPerformanceDto> getTechnicianPerformance() {

        List<User> technicians =
                userRepository.findByRole(
                        Role.TECHNICIAN
                );

        return technicians.stream()

                .map(tech -> {

                    long assigned =
                            complaintRepository
                                    .countByTechnicianId(
                                            tech.getId()
                                    );

                    long resolved =
                            complaintRepository
                                    .countByTechnicianIdAndStatus(
                                            tech.getId(),
                                            ComplaintStatus.RESOLVED
                                    );

                    double completionRate =
                            assigned == 0
                                    ? 0
                                    : (resolved * 100.0)
                                    / assigned;

                    return TechnicianPerformanceDto
                            .builder()
                            .technicianId(
                                    tech.getId()
                            )
                            .technicianName(
                                    tech.getName()
                            )
                            .assignedComplaints(
                                    assigned
                            )
                            .resolvedComplaints(
                                    resolved
                            )
                            .completionRate(
                                    completionRate
                            )
                            .build();
                })

                .toList();
    }
}