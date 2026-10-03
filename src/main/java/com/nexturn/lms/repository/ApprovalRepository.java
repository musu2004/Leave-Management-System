package com.nexturn.lms.repository;

import com.nexturn.lms.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

}
