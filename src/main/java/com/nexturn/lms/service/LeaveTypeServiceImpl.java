package com.nexturn.lms.service;

import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LeaveTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveTypeServiceImpl implements LeaveTypeService {

    private final LeaveTypeRepository repository;

    public LeaveTypeServiceImpl(LeaveTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<LeaveType> getAll() {
        return repository.findAll();
    }

    @Override
    public LeaveType save(LeaveType leaveType) {
        return repository.save(leaveType);
    }

    @Override
    public LeaveType getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave type not found"));
    }
}