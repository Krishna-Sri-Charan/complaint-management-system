package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.model.ComplaintUpdate;
import com.cms.service.ComplaintService;
import com.cms.service.ComplaintUpdateService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private ComplaintUpdateService complaintUpdateService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<Complaint> createComplaint(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long userId,
            @RequestParam(required = false) MultipartFile file
    ) throws Exception {

        ComplaintRequest request = new ComplaintRequest();

        request.setTitle(title);
        request.setDescription(description);

        Complaint complaint =
                complaintService.createComplaint(request, userId, file);

        return ApiResponse.<Complaint>builder()
                .success(true)
                .message("Complaint created successfully")
                .data(complaint)
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public ApiResponse<List<Complaint>> getUserComplaints(@RequestParam Long userId) {

        return ApiResponse.<List<Complaint>>builder()
                .success(true)
                .message("Complaints fetched successfully")
                .data(complaintService.getUserComplaints(userId))
                .build();
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {

        return complaintService.getComplaintById(id);
    }
    
    @GetMapping("/{id}/updates")
    public List<ComplaintUpdate> getComplaintUpdates(@PathVariable Long id) {

        Complaint complaint = complaintService.getComplaintById(id);

        return complaintUpdateService.getComplaintUpdates(complaint);
    }
    
    @GetMapping
    public ApiResponse<Page<Complaint>> getAllComplaints(Pageable pageable) {

        return ApiResponse.<Page<Complaint>>builder()
                .success(true)
                .message("All complaints fetched")
                .data(complaintService.getAllComplaints(pageable))
                .build();
    }
}