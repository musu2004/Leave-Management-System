package com.nexturn.lms.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LeaveScheduler {
    // Placeholder for monthly/annual accrual and reminder jobs.
    // Add the organization's exact accrual/carry-forward rules here.
    @Scheduled(cron = "0 0 0 1 * *")
    public void monthlyAccrualJob() {
        // Intentionally left rule-driven because the supplied requirements
        // specify accrual/carry-forward but not the exact monthly formula.
    }
}
