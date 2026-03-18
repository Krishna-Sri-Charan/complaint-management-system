package com.cms.controller;

import com.cms.model.Complaint;
import com.cms.model.ComplaintStatus;
import com.cms.model.User;
import com.cms.service.ComplaintService;
import com.cms.service.ComplaintUpdateService;
import com.cms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/technician")
public class TechnicianController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private ComplaintUpdateService complaintUpdateService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/complaints")
    public List<Complaint> getAssignedComplaints(@RequestParam Long technicianId) {

        return complaintService.getTechnicianComplaints(technicianId);
    }

    @PutMapping("/update-status")
    public Complaint updateStatus(@RequestParam Long complaintId,
                                  @RequestParam ComplaintStatus status) {

        return complaintService.updateStatus(complaintId, status);
    }

    @PostMapping("/add-update")
    public String addUpdate(@RequestParam Long complaintId,
                            @RequestParam Long technicianId,
                            @RequestParam String message) {

        Complaint complaint = complaintService.getComplaintById(complaintId);

        User technician = userRepository.findById(technicianId).orElseThrow();

        complaintUpdateService.addUpdate(complaint, message, technician);

        return "Update added successfully";
    }
}