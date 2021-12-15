package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Category;
import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.UserDetails;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Product entity.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(
        value = "select distinct product from Product product left join fetch product.relatedCategories left join fetch product.tags",
        countQuery = "select count(distinct product) from Product product"
    )
    Page<Product> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct product from Product product left join fetch product.relatedCategories left join fetch product.tags")
    List<Product> findAllWithEagerRelationships(Sort sort);

    @Query(
        "select distinct product from Product product left join fetch product.relatedCategories left join fetch product.tags " +
        "where(  lower(product.name)        like concat('%', :query, '%')   " +
        "or      lower(product.origin)      like concat('%', :query, '%')   " +
        "or      lower(product.brand)       like concat('%', :query, '%')  )"
    )
    List<Product> findAllFromResearch(@Param("query") String query, Sort sort);

    @Query(
        "select product from Product product left join fetch product.relatedCategories left join fetch product.tags where product.id =:id"
    )
    Optional<Product> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select userDetails.favorites from UserDetails userDetails where userDetails.user.login =:login")
    List<Product> findFavoriteByLogin(@Param("login") String login);

    @Query("select userDetails from UserDetails userDetails left join fetch userDetails.favorites where userDetails.user.login =:login")
    UserDetails getUserDetails(@Param("login") String login);

    @Query(
        "select distinct product from Product product left join fetch product.relatedCategories rc left join fetch product.tags where :cat = rc"
    )
    List<Product> findAllFromCategory(@Param("cat") Category cat, Sort sort);
}
