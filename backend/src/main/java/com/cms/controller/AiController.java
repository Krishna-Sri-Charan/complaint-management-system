package com.cms.controller;

import com.cms.dto.AiComplaintResponse;
import com.cms.dto.AiSuggestionResponse;
import com.cms.dto.ApiResponse;

import com.cms.service.AiService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/analyze")
    public ApiResponse<AiComplaintResponse> analyzeComplaint(
            @RequestBody String complaint
    ) {

        return ApiResponse.<AiComplaintResponse>builder()

                .success(true)

                .message("AI analysis completed")

                .data(
                        aiService.analyzeComplaint(
                                complaint
                        )
                )

                .build();
    }
    
    @PostMapping("/suggestions")
    public ApiResponse<AiSuggestionResponse> generateSuggestions(
            @RequestBody String complaint
    ) {

        return ApiResponse
                .<AiSuggestionResponse>builder()

                .success(true)

                .message("AI suggestions generated")

                .data(
                        aiService.generateSuggestions(
                                complaint
                        )
                )

                .build();
    }
}