package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.TechnicianDto;
import com.cms.model.Complaint;
import com.cms.model.ComplaintPriority;
import com.cms.service.ComplaintService;
import com.cms.model.ComplaintStatus;
import com.cms.model.Role;
import com.cms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/complaints")
    public Page<Complaint> getAllComplaints(Pageable pageable) {

        return complaintService.getAllComplaints(pageable);

    }
    
    @PutMapping("/assign-technician")
    public Complaint assignTechnician(@RequestParam Long complaintId,
                                      @RequestParam Long technicianId,
                                      Principal principal) {

        return complaintService.assignTechnician(complaintId, technicianId, principal.getName());
    }
    
    @PutMapping("/update-status")
    public Complaint updateStatus(@RequestParam Long complaintId,
                                  @RequestParam ComplaintStatus status,
                                  Principal principal) {

        return complaintService.updateStatus(complaintId, status, principal.getName());
    }

    @GetMapping("/search")
    public ApiResponse<List<Complaint>> searchComplaints(
            @RequestParam String keyword,
            @RequestParam ComplaintStatus status,
            @RequestParam ComplaintPriority priority
    ) {

        return ApiResponse.<List<Complaint>>builder()
                .success(true)
                .message("Complaints fetched")
                .data(
                        complaintService.searchComplaints(
                                keyword,
                                status,
                                priority
                        )
                )
                .build();
    }
    
    @GetMapping("/technicians")
    public ApiResponse<List<TechnicianDto>> getTechnicians() {

        List<TechnicianDto> technicians =
                userRepository.findByRole(Role.TECHNICIAN)
                        .stream()
                        .map(user ->
                                TechnicianDto.builder()
                                        .id(user.getId())
                                        .name(user.getName())
                                        .email(user.getEmail())
                                        .specialization(
                                                user.getSpecialization()
                                        )
                                        .build()
                        )
                        .toList();

        return ApiResponse.<List<TechnicianDto>>builder()
                .success(true)
                .message("Technicians fetched")
                .data(technicians)
                .build();
    }
}