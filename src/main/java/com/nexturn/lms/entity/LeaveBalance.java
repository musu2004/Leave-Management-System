package com.nexturn.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "leave_balance",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"emp_id", "leave_type_id", "year"}
        )
)
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer balanceId;

    @Column(name = "emp_id", nullable = false)
    private Integer empId;

    @Column(name = "leave_type_id", nullable = false)
    private Integer leaveTypeId;

    @Column(nullable = false)
    private Integer totalAllocatedDays;

    @Column(nullable = false)
    private Integer usedDays = 0;

    @Column(nullable = false)
    private Integer remainingDays;

    @Column(nullable = false)
    private Integer year;

    public LeaveBalance() {
    }

    public Integer getBalanceId() {
        return balanceId;
    }

    public Integer getEmpId() {
        return empId;
    }

    public void setEmpId(Integer empId) {
        this.empId = empId;
    }

    public Integer getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Integer leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public Integer getTotalAllocatedDays() {
        return totalAllocatedDays;
    }

    public void setTotalAllocatedDays(Integer totalAllocatedDays) {
        this.totalAllocatedDays = totalAllocatedDays;
    }

    public Integer getUsedDays() {
        return usedDays;
    }

    public void setUsedDays(Integer usedDays) {
        this.usedDays = usedDays;
    }

    public Integer getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(Integer remainingDays) {
        this.remainingDays = remainingDays;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}