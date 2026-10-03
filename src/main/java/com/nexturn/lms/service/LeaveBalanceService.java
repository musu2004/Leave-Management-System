package com.nexturn.lms.service;

import com.nexturn.lms.entity.LeaveBalance;
import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LeaveBalanceRepository;
import com.nexturn.lms.repository.LeaveTypeRepository;
import org.springframework.stereotype.Service;
import java.time.Year;

@Service
public class LeaveBalanceService {
    private final LeaveBalanceRepository balanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveBalanceService(LeaveBalanceRepository balanceRepository, LeaveTypeRepository leaveTypeRepository) {
        this.balanceRepository = balanceRepository;
        this.leaveTypeRepository = leaveTypeRepository;
    }

    public LeaveBalance get(Integer empId, Integer leaveTypeId, int year) {
        return balanceRepository.findByEmpIdAndLeaveTypeIdAndYear(empId, leaveTypeId, year)
                .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found"));
    }

    public LeaveBalance initialize(Integer empId, Integer leaveTypeId, int year) {
        LeaveType type = leaveTypeRepository.findById(leaveTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));
        LeaveBalance b = new LeaveBalance();
        b.setEmpId(empId);
        b.setLeaveTypeId(leaveTypeId);
        b.setYear(year);
        b.setTotalAllocatedDays(type.getAnnualQuota());
        b.setUsedDays(0);
        b.setRemainingDays(type.getAnnualQuota());
        return balanceRepository.save(b);
    }

    public LeaveBalance addUsedDays(Integer empId, Integer leaveTypeId, int year, int days) {
        LeaveBalance b = get(empId, leaveTypeId, year);
        b.setUsedDays(b.getUsedDays() + days);
        b.setRemainingDays(b.getTotalAllocatedDays() - b.getUsedDays());
        return balanceRepository.save(b);
    }
}

