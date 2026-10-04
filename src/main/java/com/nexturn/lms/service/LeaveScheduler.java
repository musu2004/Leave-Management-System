package com.nexturn.lms.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LeaveScheduler {
    @Scheduled(cron = "0 0 0 1 * *")
    public void monthlyAccrualJob() {
    }
}