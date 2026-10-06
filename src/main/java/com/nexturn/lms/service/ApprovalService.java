package com.nexturn.lms.service;

import com.nexturn.lms.dto.ApprovalRequest;
import com.nexturn.lms.entity.LeaveApplication;

public interface ApprovalService {

    LeaveApplication decide(Integer leaveId, ApprovalRequest request, boolean approve);
}