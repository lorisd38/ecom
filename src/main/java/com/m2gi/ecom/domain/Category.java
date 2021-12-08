package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parent", "children", "associatedProducts" }, allowSetters = true)
    private Category parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnoreProperties(value = { "parent", "associatedProducts" }, allowSetters = true)
    private Set<Category> children = new HashSet<>();

    @ManyToMany(mappedBy = "relatedCategories", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = {
            "category", "relatedCategories", "tags", "recipes", "associatedPromotions", "associatedPromotionalCodes", "favoritesOfs",
        },
        allowSetters = true
    )
    private Set<Product> associatedProducts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Category id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Category name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getParent() {
        return this.parent;
    }

    public void setParent(Category category) {
        this.parent = category;
    }

    public Category parent(Category category) {
        this.setParent(category);
        return this;
    }

    public Set<Category> getChildren() {
        return this.children;
    }

    public void setChildren(Set<Category> categories) {
        if (this.children != null) {
            this.children.forEach(i -> i.setParent(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setParent(this));
        }
        this.children = categories;
    }

    public Category children(Set<Category> categories) {
        this.setChildren(categories);
        return this;
    }

    public Category addChildren(Category category) {
        this.children.add(category);
        category.setParent(this);
        return this;
    }

    public Category removeChildren(Category category) {
        this.children.remove(category);
        category.setParent(null);
        return this;
    }

    public Set<Product> getAssociatedProducts() {
        return this.associatedProducts;
    }

    public void setAssociatedProducts(Set<Product> products) {
        if (this.associatedProducts != null) {
            this.associatedProducts.forEach(i -> i.removeRelatedCategories(this));
        }
        if (products != null) {
            products.forEach(i -> i.addRelatedCategories(this));
        }
        this.associatedProducts = products;
    }

    public Category associatedProducts(Set<Product> products) {
        this.setAssociatedProducts(products);
        return this;
    }

    public Category addAssociatedProducts(Product product) {
        this.associatedProducts.add(product);
        product.getRelatedCategories().add(this);
        return this;
    }

    public Category removeAssociatedProducts(Product product) {
        this.associatedProducts.remove(product);
        product.getRelatedCategories().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        return id != null && id.equals(((Category) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
