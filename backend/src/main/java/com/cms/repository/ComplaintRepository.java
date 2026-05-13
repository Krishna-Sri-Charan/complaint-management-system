package com.cms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.model.Complaint;
import com.cms.model.ComplaintStatus;
import com.cms.model.User;
import com.cms.model.ComplaintPriority;
import com.cms.model.ComplaintStatus;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser(User user);

    List<Complaint> findByTechnician(User technician);
    
    long countByStatus(ComplaintStatus status);

    List<Complaint> findByTitleContainingIgnoreCaseAndStatusAndPriority(
            String title,
            ComplaintStatus status,
            ComplaintPriority priority
    );
}