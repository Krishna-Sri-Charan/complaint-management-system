package com.cms.service;

import com.cms.dto.ComplaintRequest;
import com.cms.model.Complaint;
import com.cms.model.User;
import com.cms.repository.ComplaintRepository;
import com.cms.repository.UserRepository;
import com.cms.exception.ResourceNotFoundException;

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
                .status("OPEN")
                .priority("MEDIUM")
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
}