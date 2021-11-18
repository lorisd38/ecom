package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.Product;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    /*
    @Query(
        value = "With R1 as (select cart.lines as  from " +
            "select sum(cart.lines.quantity * cart.lines.product.price) from Cart cart where cart.id=:id"
    )
    Optional<Integer> getTotalPrice(@Param("id") long id);
    */
}
