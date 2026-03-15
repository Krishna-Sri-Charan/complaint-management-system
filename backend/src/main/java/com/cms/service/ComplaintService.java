package com.cms.service;

import com.cms.model.Complaint;
import com.cms.model.User;
import com.cms.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getUserComplaints(User user) {
        return complaintRepository.findByUser(user);
    }

    public List<Complaint> getTechnicianComplaints(User technician) {
        return complaintRepository.findByTechnician(technician);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

}