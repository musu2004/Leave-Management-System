package com.nexturn.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nexturn.lms.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT MAX(e.empId) FROM Employee e")
    Integer findMaxEmpId();

    List<Employee> findByManagerId(Integer managerId);
}