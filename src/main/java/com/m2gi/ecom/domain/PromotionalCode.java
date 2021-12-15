package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.m2gi.ecom.domain.enumeration.ReductionType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A PromotionalCode.
 */
@Entity
@Table(name = "promotional_code")
public class PromotionalCode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false, updatable = false)
    private String code;

    @NotNull
    @Column(name = "start_date", nullable = false, updatable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Column(name = "value", precision = 21, scale = 2, nullable = false, updatable = false)
    private BigDecimal value;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false, updatable = false)
    private ReductionType unit;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_promotional_code__products",
        joinColumns = @JoinColumn(name = "promotional_code_id"),
        inverseJoinColumns = @JoinColumn(name = "products_id")
    )
    @JsonIgnoreProperties(
        value = {
            "category", "relatedCategories", "tags", "recipes", "associatedPromotions", "associatedPromotionalCodes", "favoritesOfs",
        },
        allowSetters = true
    )
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public boolean isActive(Instant instant) {
        return !(instant.isBefore(this.startDate) || instant.isAfter(this.endDate));
    }

    public BigDecimal applyTo(BigDecimal amount) {
        if (this.unit == ReductionType.FIX) return amount.subtract(this.value); else return amount.subtract(
            amount.multiply(this.value.scaleByPowerOfTen(-2))
        );
    }

    public Long getId() {
        return this.id;
    }

    public PromotionalCode id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public PromotionalCode code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public PromotionalCode startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public PromotionalCode endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getValue() {
        return this.value;
    }

    public PromotionalCode value(BigDecimal value) {
        this.setValue(value);
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public ReductionType getUnit() {
        return this.unit;
    }

    public PromotionalCode unit(ReductionType unit) {
        this.setUnit(unit);
        return this;
    }

    public void setUnit(ReductionType unit) {
        this.unit = unit;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public PromotionalCode products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public PromotionalCode addProducts(Product product) {
        this.products.add(product);
        return this;
    }

    public PromotionalCode removeProducts(Product product) {
        this.products.remove(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PromotionalCode)) {
            return false;
        }
        return id != null && id.equals(((PromotionalCode) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PromotionalCode{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", value=" + getValue() +
            ", unit='" + getUnit() + "'" +
            "}";
    }
}
