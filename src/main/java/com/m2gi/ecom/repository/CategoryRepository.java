package com.m2gi.ecom.repository;

import com.m2gi.ecom.domain.Category;
import com.m2gi.ecom.domain.Product;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select distinct category from Category category left join fetch category.children where category.parent is null")
    List<Category> findAllWithoutParents();
}
