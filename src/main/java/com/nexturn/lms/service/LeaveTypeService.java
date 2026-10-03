package com.nexturn.lms.service;

import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LeaveTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveTypeService {
    private final LeaveTypeRepository repository;

    public LeaveTypeService(LeaveTypeRepository repository) { this.repository = repository; }

    public List<LeaveType> getAll() { return repository.findAll(); }
    public LeaveType save(LeaveType leaveType) { return repository.save(leaveType); }
    public LeaveType getById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));
    }
}



