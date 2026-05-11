package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.DashboardStatsResponse;
import com.cms.service.AnalyticsService;

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
}