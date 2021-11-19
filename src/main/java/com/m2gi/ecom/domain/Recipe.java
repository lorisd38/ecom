package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Recipe.
 */
@Entity
@Table(name = "recipe")
public class Recipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "steps")
    private String steps;

    @Column(name = "image_path")
    private String imagePath;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
        name = "rel_recipe__products",
        joinColumns = @JoinColumn(name = "recipe_id"),
        inverseJoinColumns = @JoinColumn(name = "products_id")
    )
    @JsonIgnoreProperties(value = { "category", "relatedCtegories", "tags", "recipes", "promotions", "favoritesOfs" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Recipe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Recipe name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Recipe description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSteps() {
        return this.steps;
    }

    public Recipe steps(String steps) {
        this.setSteps(steps);
        return this;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public Recipe imagePath(String imagePath) {
        this.setImagePath(imagePath);
        return this;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public Recipe products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Recipe addProducts(Product product) {
        this.products.add(product);
        product.getRecipes().add(this);
        return this;
    }

    public Recipe removeProducts(Product product) {
        this.products.remove(product);
        product.getRecipes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recipe)) {
            return false;
        }
        return id != null && id.equals(((Recipe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recipe{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", steps='" + getSteps() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            "}";
    }
}
