package com.cms.service;

import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.model.User;
import com.cms.repository.ComplaintRepository;
import com.cms.repository.UserRepository;
import com.cms.exception.ResourceNotFoundException;
import com.cms.model.ComplaintStatus;
import com.cms.model.ComplaintPriority;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ComplaintUpdateService complaintUpdateService;

    public Complaint createComplaint(ComplaintRequest request, Long userId) {

    	User user = userRepository.findById(userId)
    	        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .priority(ComplaintPriority.MEDIUM)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        
        Complaint savedComplaint = complaintRepository.save(complaint);

        complaintUpdateService.addUpdate(
                savedComplaint,
                "Complaint created",
                user
        );

        return savedComplaint;
    }

    public List<Complaint> getUserComplaints(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUser(user);
    }

    public Complaint getComplaintById(Long id) {

        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();
    }
    
    public Complaint assignTechnician(Long complaintId, Long technicianId) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        complaint.setTechnician(technician);
        
        complaintUpdateService.addUpdate(
                complaint,
                "Technician assigned",
                technician
        );

        return complaintRepository.save(complaint);
    }
    
    public Complaint updateStatus(Long complaintId, ComplaintStatus status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);
        
        complaintUpdateService.addUpdate(
                complaint,
                "Status changed to " + status,
                complaint.getUser()
        );

        return complaintRepository.save(complaint);
    }
    
    public Page<Complaint> getAllComplaints(Pageable pageable) {

        return complaintRepository.findAll(pageable);

    }
}