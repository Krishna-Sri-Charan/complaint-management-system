package com.cms.service;

import com.cms.model.Complaint;
import com.cms.model.ComplaintUpdate;
import com.cms.model.User;
import com.cms.repository.ComplaintUpdateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintUpdateService {

    @Autowired
    private ComplaintUpdateRepository complaintUpdateRepository;

    public void addUpdate(Complaint complaint, String message, User user) {

        ComplaintUpdate update = ComplaintUpdate.builder()
                .complaint(complaint)
                .message(message)
                .updatedBy(user)
                .createdAt(LocalDateTime.now())
                .build();

        complaintUpdateRepository.save(update);
    }

    public List<ComplaintUpdate> getComplaintUpdates(Complaint complaint) {

        return complaintUpdateRepository.findByComplaint(complaint);
    }
}