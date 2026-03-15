package com.cms.controller;

import com.cms.model.Complaint;
import com.cms.service.ComplaintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {

        return complaintService.getAllComplaints();
    }
    
    @PutMapping("/assign-technician")
    public Complaint assignTechnician(@RequestParam Long complaintId,
                                      @RequestParam Long technicianId) {

        return complaintService.assignTechnician(complaintId, technicianId);
    }
    
    @PutMapping("/update-status")
    public Complaint updateStatus(@RequestParam Long complaintId,
                                  @RequestParam String status) {

        return complaintService.updateStatus(complaintId, status);
    }

}