package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.PromotionalCode;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PromotionalCode entity.
 */
@Repository
public interface PromotionalCodeRepository extends JpaRepository<PromotionalCode, Long> {
    @Query(
        value = "select distinct promotionalCode from PromotionalCode promotionalCode left join fetch promotionalCode.products",
        countQuery = "select count(distinct promotionalCode) from PromotionalCode promotionalCode"
    )
    Page<PromotionalCode> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct promotionalCode from PromotionalCode promotionalCode left join fetch promotionalCode.products")
    List<PromotionalCode> findAllWithEagerRelationships();

    @Query(
        "select promotionalCode from PromotionalCode promotionalCode left join fetch promotionalCode.products where promotionalCode.id =:id"
    )
    Optional<PromotionalCode> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select distinct promotionalCode from PromotionalCode promotionalCode left join fetch promotionalCode.products " +
        " where promotionalCode.code = :code and :date between promotionalCode.startDate and promotionalCode.endDate")
    Optional<PromotionalCode> findActiveWithEagerRelationshipsByCode(@Param("code") String code,
                                                                     @Param("date") Instant date);
}
