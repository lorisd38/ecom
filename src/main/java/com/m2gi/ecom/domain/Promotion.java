package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Promotion.
 */
@Entity
@Table(name = "promotion")
public class Promotion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Column(name = "reduction_percentage", precision = 21, scale = 2, nullable = false)
    private BigDecimal reductionPercentage;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
        name = "rel_promotion__products",
        joinColumns = @JoinColumn(name = "promotion_id"),
        inverseJoinColumns = @JoinColumn(name = "products_id")
    )
    @JsonIgnoreProperties(value = { "category", "relatedCtegories", "tags", "recipes", "promotions", "favoritesOfs" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Promotion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Promotion startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public Promotion endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getReductionPercentage() {
        return this.reductionPercentage;
    }

    public Promotion reductionPercentage(BigDecimal reductionPercentage) {
        this.setReductionPercentage(reductionPercentage);
        return this;
    }

    public void setReductionPercentage(BigDecimal reductionPercentage) {
        this.reductionPercentage = reductionPercentage;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public Promotion products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Promotion addProducts(Product product) {
        this.products.add(product);
        product.getPromotions().add(this);
        return this;
    }

    public Promotion removeProducts(Product product) {
        this.products.remove(product);
        product.getPromotions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Promotion)) {
            return false;
        }
        return id != null && id.equals(((Promotion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Promotion{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", reductionPercentage=" + getReductionPercentage() +
            "}";
    }
}
