package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.ProductCart;
import java.lang.annotation.Native;
import org.springframework.data.jpa.repository.*;
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
}
