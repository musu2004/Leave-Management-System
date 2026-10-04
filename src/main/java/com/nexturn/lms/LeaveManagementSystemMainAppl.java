package com.nexturn.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LeaveManagementSystemMainAppl {

    public static void main(String[] args) {
        SpringApplication.run(LeaveManagementSystemMainAppl.class, args);
    }
}