package com.nexturn.lms.service;

import com.nexturn.lms.dto.LeaveRequest;
import com.nexturn.lms.entity.LeaveApplication;
import java.util.List;

public interface LeaveService {
    LeaveApplication apply(LeaveRequest request);
    List<LeaveApplication> history(Integer empId);
    LeaveApplication cancel(Integer leaveId, Integer empId);
    LeaveApplication getById(Integer id);
}