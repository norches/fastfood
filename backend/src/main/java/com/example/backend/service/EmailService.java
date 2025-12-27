package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.entity.OrderProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String adminEmail;
    private final String mailFrom;
    private final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender mailSender, @Value("${app.admin.email}") String adminEmail, @Value("${spring.mail.username}") String mailFrom) {
        this.mailSender = mailSender;
        this.adminEmail = adminEmail;
        this.mailFrom = mailFrom;
    }

    @Async
    public void sendOrderNotification(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(adminEmail);
            message.setSubject("New order placed: " + order.getId());


            StringBuilder body = new StringBuilder();
            body.append("Total: ").append(order.getTotalPrice()).append("\n");
            body.append("Location: ").append(order.getLocation()).append("\n\n");
            body.append("Username: ").append(order.getUser().getLastName()).append("\n\n");
            body.append("Items:\n");
            if (order.getOrderProducts() != null) {
                for (OrderProduct op : order.getOrderProducts()) {
                    body.append(op.getProduct().getName())
                            .append(" x")
                            .append(op.getQuantity())
                            .append("\n");
                }
            }

            message.setText(body.toString());
            mailSender.send(message);
            log.info("Order notification email sent to {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send order notification email", e);
        }
    }
}
