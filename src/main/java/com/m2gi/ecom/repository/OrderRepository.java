package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select jhi_order from Order jhi_order left join fetch jhi_order.lines ")
    List<Order> findAllWithEagerRelationshipsByLogin(@Param("login") String login);
}
