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

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

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

        return complaintRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
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

        return complaintRepository.save(complaint);
    }
    
    public Complaint updateStatus(Long complaintId, ComplaintStatus status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }
}