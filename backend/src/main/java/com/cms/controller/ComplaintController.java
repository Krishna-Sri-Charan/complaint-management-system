package com.cms.controller;

import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.model.User;
import com.cms.repository.UserRepository;
import com.cms.service.ComplaintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Complaint createComplaint(@RequestBody ComplaintRequest request,
                                     @RequestParam Long userId) {

        User user = userRepository.findById(userId).orElseThrow();

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status("OPEN")
                .priority("MEDIUM")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return complaintService.createComplaint(complaint);
    }

    @GetMapping("/my")
    public List<Complaint> getUserComplaints(@RequestParam Long userId) {

        User user = userRepository.findById(userId).orElseThrow();

        return complaintService.getUserComplaints(user);
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {

        return complaintService.getAllComplaints()
                .stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow();
    }
}