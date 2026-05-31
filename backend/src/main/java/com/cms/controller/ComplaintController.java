package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.model.ComplaintUpdate;
import com.cms.service.ComplaintService;
import com.cms.service.ComplaintUpdateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/complaints")
@PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private ComplaintUpdateService complaintUpdateService;

    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<Complaint> createComplaint(

            @RequestParam String title,

            @RequestParam String description,
            
            @RequestParam(required = false)
            String aiCategory,

            @RequestParam(required = false)
            String aiPriority,

            @RequestParam
            String userPriority,

            @RequestParam(required = false)
            MultipartFile file,

            Principal principal

    ) throws Exception {

        ComplaintRequest request =
                new ComplaintRequest();

        request.setTitle(title);

        request.setDescription(description);

        request.setAiCategory(aiCategory);

        request.setAiPriority(aiPriority);
        
        request.setUserPriority(userPriority);
        
        Complaint complaint =

                complaintService.createComplaint(

                        request,

                        principal.getName(),

                        file
                );
        System.out.println(principal.getName());

        return ApiResponse.<Complaint>builder()

                .success(true)

                .message("Complaint created successfully")

                .data(complaint)

                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<Complaint>> getMyComplaints(
            Principal principal
    ) {

        return ApiResponse.<List<Complaint>>builder()

                .success(true)

                .message("Complaints fetched")

                .data(
                        complaintService.getUserComplaints(
                                principal.getName()
                        )
                )

                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Complaint> getComplaintById(
            @PathVariable Long id
    ) {

        return ApiResponse.<Complaint>builder()

                .success(true)

                .message("Complaint fetched")

                .data(
                        complaintService
                                .getComplaintById(id)
                )

                .build();
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