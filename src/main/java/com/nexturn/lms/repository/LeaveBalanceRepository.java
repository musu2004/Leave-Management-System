package com.nexturn.lms.repository;

import com.nexturn.lms.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Integer> {

    Optional<LeaveBalance> findByEmpIdAndLeaveTypeIdAndYear(
            Integer empId,
            Integer leaveTypeId,
            Integer year);
}