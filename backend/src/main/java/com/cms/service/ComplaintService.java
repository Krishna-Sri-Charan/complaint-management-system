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
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    public Complaint createComplaint(
            ComplaintRequest request,
            Long userId,
            MultipartFile file
    ) throws Exception {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fileName = null;

        if (file != null && !file.isEmpty()) {

            fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(
                    file.getInputStream(),
                    uploadPath.resolve(fileName)
            );
        }

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .attachmentUrl(fileName)
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
    
    public List<Complaint> getTechnicianComplaints(Long technicianId) {

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        return complaintRepository.findByTechnician(technician);
    }
    
    public List<Complaint> searchComplaints(
            String keyword,
            ComplaintStatus status,
            ComplaintPriority priority
    ) {

        return complaintRepository
                .findByTitleContainingIgnoreCaseAndStatusAndPriority(
                        keyword,
                        status,
                        priority
                );
    }
}