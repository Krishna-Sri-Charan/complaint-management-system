package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.ComplaintAnalyticsResponse;
import com.cms.dto.DashboardStatsResponse;
import com.cms.dto.TechnicianDashboardStats;
import com.cms.dto.UserDashboardStats;
import com.cms.service.AnalyticsService;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {

        return ApiResponse.<DashboardStatsResponse>builder()
                .success(true)
                .message("Dashboard statistics fetched")
                .data(analyticsService.getDashboardStats())
                .build();
    }
    
    @GetMapping("/complaints")
    public ApiResponse<ComplaintAnalyticsResponse>
    getComplaintAnalytics() {

        return ApiResponse
                .<ComplaintAnalyticsResponse>builder()
                .success(true)
                .message("Analytics fetched")
                .data(analyticsService.getComplaintAnalytics())
                .build();
    }
    
    @GetMapping("/my-dashboard")
    public ApiResponse<UserDashboardStats>
    getMyDashboardStats(
            Principal principal
    ) {

        return ApiResponse
                .<UserDashboardStats>builder()
                .success(true)
                .message("User dashboard stats")
                .data(
                        analyticsService
                                .getUserDashboardStats(
                                        principal.getName()
                                )
                )
                .build();
    }
    
    @GetMapping("/technician-dashboard")
    public ApiResponse<TechnicianDashboardStats>
    getTechnicianDashboard(
            Principal principal
    ) {

        return ApiResponse
                .<TechnicianDashboardStats>builder()

                .success(true)

                .message("Technician dashboard")

                .data(
                        analyticsService
                                .getTechnicianDashboardStats(
                                        principal.getName()
                                )
                )

                .build();
    }
}