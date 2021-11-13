package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.UserDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data SQL repository for the Cart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query(
        "select cart from Cart cart left join fetch cart.lines where cart.user.user.login =:login"
    )
    Optional<Cart> findOneWithEagerRelationshipsByLogin(@Param("login") String login);
}
