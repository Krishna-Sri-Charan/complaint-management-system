package com.cms.controller;

import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.service.ComplaintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public Complaint createComplaint(@RequestBody ComplaintRequest request,
                                     @RequestParam Long userId) {

        return complaintService.createComplaint(request, userId);
    }

    @GetMapping("/my")
    public List<Complaint> getUserComplaints(@RequestParam Long userId) {

        return complaintService.getUserComplaints(userId);
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {

        return complaintService.getComplaintById(id);
    }
}