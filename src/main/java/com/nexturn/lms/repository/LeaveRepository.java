package com.nexturn.lms.repository;

import com.nexturn.lms.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveApplication, Integer> {

    List<LeaveApplication> findByEmpId(Integer empId);
    List<LeaveApplication> findByEmpIdAndStatus(Integer empId, com.nexturn.lms.enums.LeaveStatus status);

}