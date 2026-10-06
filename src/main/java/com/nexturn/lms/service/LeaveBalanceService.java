package com.nexturn.lms.service;

import com.nexturn.lms.entity.LeaveBalance;

public interface LeaveBalanceService {
    LeaveBalance get(Integer empId, Integer leaveTypeId, int year);
    LeaveBalance initialize(Integer empId, Integer leaveTypeId, int year);
    LeaveBalance addUsedDays(Integer empId, Integer leaveTypeId, int year, int days);
}