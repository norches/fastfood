package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderCleanupService {

    @Autowired
    private OrderRepo orderRepo;

    private static final int STEP_TIME_MINUTES = 10;
    private static final int TOTAL_STEPS = 3;
    private static final int TOTAL_DELIVERY_TIME = STEP_TIME_MINUTES * TOTAL_STEPS;

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void deleteCompletedOrders() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(TOTAL_DELIVERY_TIME);

        List<Order> completedOrders = orderRepo.findOrdersOlderThan(cutoffTime);

        if (!completedOrders.isEmpty()) {
            orderRepo.deleteAll(completedOrders);
            System.out.println("Deleted " + completedOrders.size() + " completed orders with status 'yetkazildi'");
        }
    }
}