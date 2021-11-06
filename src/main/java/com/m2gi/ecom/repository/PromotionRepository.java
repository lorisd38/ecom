package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Promotion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Promotion entity.
 */
@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    @Query(
        value = "select distinct promotion from Promotion promotion left join fetch promotion.products",
        countQuery = "select count(distinct promotion) from Promotion promotion"
    )
    Page<Promotion> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct promotion from Promotion promotion left join fetch promotion.products")
    List<Promotion> findAllWithEagerRelationships();

    @Query("select promotion from Promotion promotion left join fetch promotion.products where promotion.id =:id")
    Optional<Promotion> findOneWithEagerRelationships(@Param("id") Long id);
}
