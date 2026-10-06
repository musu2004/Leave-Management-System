package com.nexturn.lms.service;

import com.nexturn.lms.entity.LeaveType;
import java.util.List;

public interface LeaveTypeService {
    List<LeaveType> getAll();
    LeaveType save(LeaveType leaveType);
    LeaveType getById(Integer id);
}