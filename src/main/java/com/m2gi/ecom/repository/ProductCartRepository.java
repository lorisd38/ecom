package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.ProductCart;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductCart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCartRepository extends JpaRepository<ProductCart, Long> {
    @Modifying
    @Query("delete from ProductCart p where p.id=:id")
    void deleteWithId(@Param("id") long id);

    List<ProductCart> findAllByCreationDatetimeBefore(Instant datetime);
}
