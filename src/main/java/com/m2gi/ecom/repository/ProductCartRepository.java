package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.ProductCart;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductCart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCartRepository extends JpaRepository<ProductCart, Long> {}
