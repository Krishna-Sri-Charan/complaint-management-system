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
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private NotificationService notificationService;

    public Complaint createComplaint(
            ComplaintRequest request,
            String email,
            MultipartFile file
    ) throws Exception {

        User user = userRepository.findByEmail(email)
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
        
        String finalPriority =

        	    request.getAiPriority() != null
        	            &&
        	    !request.getAiPriority().isBlank()

        	    ?

        	    request.getAiPriority()

        	    :

        	    request.getUserPriority();

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .attachmentUrl(fileName)
                .status(ComplaintStatus.OPEN)
                .aiCategory(request.getAiCategory())
                .priority(
            	    ComplaintPriority.valueOf(
            	            finalPriority
            	                    .trim()
            	                    .toUpperCase()
            	    )
            	)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        complaintUpdateService.addUpdate(
                savedComplaint,
                "Complaint created",
                user
        );
        
        try {

            emailService.sendEmail(
                    user.getEmail(),
                    "Complaint Created Successfully",
                    "Your complaint '" + complaint.getTitle()
                            + "' has been registered successfully."
            );

        } catch (Exception e) {

            System.out.println(
                    "Email sending failed"
            );
        }
        
        return savedComplaint;
    }

    public List<Complaint> getUserComplaints(
            String email
    ) {

        User user =

                userRepository.findByEmail(email)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return complaintRepository.findByUser(
                user
        );
    }

    public Complaint getComplaintById(
            Long id
    ) {

        return complaintRepository
                .findById(id)

                .orElseThrow(() ->

                        new ResourceNotFoundException(
                                "Complaint not found"
                        )
                );
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
        
        emailService.sendEmail(
                complaint.getUser().getEmail(),
                "Technician Assigned",
                "Your complaint has been assigned to technician "
                        + technician.getName()
        );
        
        notificationService.sendNotification(
                "Complaint #" + complaint.getId()
                        + " assigned to "
                        + technician.getName()
        );
        
        return complaintRepository.save(complaint);
    }
    
    public Complaint updateStatus(Long complaintId, ComplaintStatus status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);
        
        notificationService.sendNotification(
                "Complaint #" + complaint.getId()
                        + " updated to "
                        + status
        );
        
        notificationService.sendNotification(
                "Complaint status updated to "
                        + status
        );
        
        if (status == ComplaintStatus.RESOLVED) {

            emailService.sendEmail(
                    complaint.getUser().getEmail(),
                    "Complaint Resolved",
                    "Your complaint '" + complaint.getTitle()
                            + "' has been resolved."
            );
        }

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