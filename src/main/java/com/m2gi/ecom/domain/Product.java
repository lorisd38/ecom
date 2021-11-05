package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
public class Product implements Serializable {

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

    @Column(name = "origin")
    private String origin;

    @Column(name = "brand")
    private String brand;

    @Column(name = "image_path")
    private String imagePath;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "weight", precision = 21, scale = 2)
    private BigDecimal weight;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parent" }, allowSetters = true)
    private Category category;

    @ManyToMany
    @JoinTable(
        name = "rel_product__tags",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "tags_id")
    )
    @JsonIgnoreProperties(value = { "products", "preferencesOfs" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(mappedBy = "products")
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Set<Recipe> recipes = new HashSet<>();

    /**
     * Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.
     */
    @ApiModelProperty(value = "Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.")
    @ManyToMany(mappedBy = "products")
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Set<Promotion> promotions = new HashSet<>();

    /**
     * Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.
     */
    @ApiModelProperty(value = "Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.")
    @ManyToMany(mappedBy = "favorites")
    @JsonIgnoreProperties(value = { "address", "user", "favorites", "preferences" }, allowSetters = true)
    private Set<UserDetails> favoritesOfs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrigin() {
        return this.origin;
    }

    public Product origin(String origin) {
        this.setOrigin(origin);
        return this;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getBrand() {
        return this.brand;
    }

    public Product brand(String brand) {
        this.setBrand(brand);
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public Product imagePath(String imagePath) {
        this.setImagePath(imagePath);
        return this;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Product price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getWeight() {
        return this.weight;
    }

    public Product weight(BigDecimal weight) {
        this.setWeight(weight);
        return this;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Product category(Category category) {
        this.setCategory(category);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Product tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Product addTags(Tag tag) {
        this.tags.add(tag);
        tag.getProducts().add(this);
        return this;
    }

    public Product removeTags(Tag tag) {
        this.tags.remove(tag);
        tag.getProducts().remove(this);
        return this;
    }

    public Set<Recipe> getRecipes() {
        return this.recipes;
    }

    public void setRecipes(Set<Recipe> recipes) {
        if (this.recipes != null) {
            this.recipes.forEach(i -> i.removeProducts(this));
        }
        if (recipes != null) {
            recipes.forEach(i -> i.addProducts(this));
        }
        this.recipes = recipes;
    }

    public Product recipes(Set<Recipe> recipes) {
        this.setRecipes(recipes);
        return this;
    }

    public Product addRecipes(Recipe recipe) {
        this.recipes.add(recipe);
        recipe.getProducts().add(this);
        return this;
    }

    public Product removeRecipes(Recipe recipe) {
        this.recipes.remove(recipe);
        recipe.getProducts().remove(this);
        return this;
    }

    public Set<Promotion> getPromotions() {
        return this.promotions;
    }

    public void setPromotions(Set<Promotion> promotions) {
        if (this.promotions != null) {
            this.promotions.forEach(i -> i.removeProducts(this));
        }
        if (promotions != null) {
            promotions.forEach(i -> i.addProducts(this));
        }
        this.promotions = promotions;
    }

    public Product promotions(Set<Promotion> promotions) {
        this.setPromotions(promotions);
        return this;
    }

    public Product addPromotions(Promotion promotion) {
        this.promotions.add(promotion);
        promotion.getProducts().add(this);
        return this;
    }

    public Product removePromotions(Promotion promotion) {
        this.promotions.remove(promotion);
        promotion.getProducts().remove(this);
        return this;
    }

    public Set<UserDetails> getFavoritesOfs() {
        return this.favoritesOfs;
    }

    public void setFavoritesOfs(Set<UserDetails> userDetails) {
        if (this.favoritesOfs != null) {
            this.favoritesOfs.forEach(i -> i.removeFavorites(this));
        }
        if (userDetails != null) {
            userDetails.forEach(i -> i.addFavorites(this));
        }
        this.favoritesOfs = userDetails;
    }

    public Product favoritesOfs(Set<UserDetails> userDetails) {
        this.setFavoritesOfs(userDetails);
        return this;
    }

    public Product addFavoritesOf(UserDetails userDetails) {
        this.favoritesOfs.add(userDetails);
        userDetails.getFavorites().add(this);
        return this;
    }

    public Product removeFavoritesOf(UserDetails userDetails) {
        this.favoritesOfs.remove(userDetails);
        userDetails.getFavorites().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", origin='" + getOrigin() + "'" +
            ", brand='" + getBrand() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", price=" + getPrice() +
            ", weight=" + getWeight() +
            "}";
    }
}
