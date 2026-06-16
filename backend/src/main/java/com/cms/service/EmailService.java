package com.cms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${host_mail}")
    private String hostMail;
    
    private static final String SIGNATURE =

            "\n\nRegards,\n"
          + "ResolveFlow AI Support Team\n"
          + "Smart Complaint Resolution Platform";

    public void sendEmail(
            String to,
            String subject,
            String body
    ) {

        try {

            System.out.println("Sending email to: " + to);

            SimpleMailMessage message =
                    new SimpleMailMessage();
            
            message.setFrom(hostMail);

            message.setTo(to);

            message.setSubject(subject);

            message.setText(body + SIGNATURE);

            mailSender.send(message);

            System.out.println("Email sent successfully");

        } catch (Exception e) {

            System.out.println("Email failed");
            e.printStackTrace();
        }
    }
}