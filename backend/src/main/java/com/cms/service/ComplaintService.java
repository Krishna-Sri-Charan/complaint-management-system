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
            
            String contentType =
                    file.getContentType();

            List<String> allowedTypes = List.of(

            		"image/jpg",
                    "image/jpeg",
                    "image/png"
            );

            if (!allowedTypes.contains(contentType)) {

                throw new IllegalArgumentException(
                        "Only JPG, JPEG and PNG files are allowed."
                );
            }
            
            if (file.getSize() > 5 * 1024 * 1024) {

                throw new IllegalArgumentException(
                        "Maximum file size is 5 MB."
                );
            }

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
        
        if (request.getTitle() == null ||
    	    request.getTitle().trim().isEmpty()) {

    	    throw new IllegalArgumentException(
    	            "Complaint title is required");
    	}

    	if (request.getDescription() == null ||
    	    request.getDescription().trim().isEmpty()) {

    	    throw new IllegalArgumentException(
    	            "Complaint description is required");
    	}

        Complaint complaint = Complaint.builder()
        		.title(request.getTitle().trim())
        		.description(request.getDescription().trim())
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
        
        notificationService.sendNotification(
                "New complaint submitted: #"
                + savedComplaint.getId()
                + " - "
                + savedComplaint.getTitle()
        );
        
        System.out.println("Notification sent");
        
        try {

        	emailService.sendEmail(
        		    user.getEmail(),
        		    "Complaint Submitted Successfully | ResolveFlow AI",

        		    "Hello " + user.getName() + ",\n\n"

        		    + "Your complaint has been successfully submitted in ResolveFlow AI.\n\n"

        		    + "Complaint Details:\n"
        		    + "---------------------------------\n"
        		    + "Complaint ID: #" + savedComplaint.getId() + "\n"
        		    + "Title: " + savedComplaint.getTitle() + "\n"
        		    + "Priority: " + savedComplaint.getPriority() + "\n"
        		    + "Status: OPEN\n\n"

        		    + "Our team will review your complaint and keep you informed of all updates.\n\n"

        		    + "Thank you for using ResolveFlow AI."
        		);

        } catch (Exception e) {

            System.out.println(
                    "Email sending failed"
            );
        }
        
        return savedComplaint;
    }

    public Page<Complaint> getUserComplaints(
            String email,
            Pageable pageable
    ) {

        User user =

                userRepository.findByEmail(email)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return complaintRepository.findByUserId(
                user.getId(),
                pageable
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
    
    public Complaint assignTechnician(Long complaintId, Long technicianId, String updatedByEmail) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        
        User assignedBy  = userRepository
                .findByEmail(updatedByEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        complaint.setTechnician(technician);
        
        complaintUpdateService.addUpdate(
                complaint,
                "Technician " + technician.getName() + " assigned",
                assignedBy
        );
        
        emailService.sendEmail(
        	    complaint.getUser().getEmail(),
        	    "Technician Assigned | ResolveFlow AI",

        	    "Hello " + complaint.getUser().getName() + ",\n\n"

        	    + "A technician has been assigned to your complaint.\n\n"

        	    + "Complaint Details:\n"
        	    + "---------------------------------\n"
        	    + "Complaint ID: #" + complaint.getId() + "\n"
        	    + "Title: " + complaint.getTitle() + "\n"
        	    + "Assigned Technician: " + technician.getName() + "\n\n"

        	    + "The technician will begin reviewing and resolving the issue shortly."
        	);
        
        notificationService.sendNotification(
                "Technician "
                + technician.getName()
                + " assigned to Complaint #"
                + complaint.getId()
        );
        
        return complaintRepository.save(complaint);
    }
    
    public Complaint updateStatus(Long complaintId, ComplaintStatus status, String updatedByEmail) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        User updater = userRepository
                .findByEmail(updatedByEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        complaint.setStatus(status);

        complaintUpdateService.addUpdate(
                complaint,
                "Status changed to " + status,
                updater
        );
        
        notificationService.sendNotification(
                "Complaint #"
                + complaint.getId()
                + " status changed to "
                + status
        );
        
        if (status == ComplaintStatus.RESOLVED) {
        	
        	complaint.setResolvedAt(
                    LocalDateTime.now()
            );

        	emailService.sendEmail(
        		    complaint.getUser().getEmail(),
        		    "Complaint Resolved | ResolveFlow AI",

        		    "Hello " + complaint.getUser().getName() + ",\n\n"

        		    + "Great news! Your complaint has been marked as resolved.\n\n"

        		    + "Complaint Details:\n"
        		    + "---------------------------------\n"
        		    + "Complaint ID: #" + complaint.getId() + "\n"
        		    + "Title: " + complaint.getTitle() + "\n"
        		    + "Status: RESOLVED\n"
        		    + "Resolved On: " + LocalDateTime.now() + "\n\n"

        		    + "If the issue still persists, please create a new complaint or contact support.\n\n"

        		    + "Thank you for using ResolveFlow AI."
        		);
        }

        return complaintRepository.save(complaint);
    }
    
    public Page<Complaint> getAllComplaints(Pageable pageable) {

        return complaintRepository.findAll(pageable);

    }
    
    public Page<Complaint> getTechnicianComplaints(Long technicianId, Pageable pageable) {

        return complaintRepository.findByTechnicianId(technicianId, pageable);
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
