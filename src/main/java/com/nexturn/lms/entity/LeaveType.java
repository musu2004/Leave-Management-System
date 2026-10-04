package com.nexturn.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_type")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveTypeId;

    @Column(nullable = false, length = 50)
    private String leaveTypeName;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(nullable = false)
    private Integer annualQuota;

    @Column(nullable = false)
    private Boolean allowNegativeBalance = false;

    public LeaveType() {
    }

    public Integer getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Integer leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getLeaveTypeName() {
        return leaveTypeName;
    }

    public void setLeaveTypeName(String leaveTypeName) {
        this.leaveTypeName = leaveTypeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAnnualQuota() {
        return annualQuota;
    }

    public void setAnnualQuota(Integer annualQuota) {
        this.annualQuota = annualQuota;
    }

    public Boolean getAllowNegativeBalance() {
        return allowNegativeBalance;
    }

    public void setAllowNegativeBalance(Boolean allowNegativeBalance) {
        this.allowNegativeBalance = allowNegativeBalance;
    }
}