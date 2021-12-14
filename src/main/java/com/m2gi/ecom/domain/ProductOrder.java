package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.m2gi.ecom.domain.enumeration.ReductionType;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A ProductOrder.
 */
@Entity
@Table(name = "product_order")
public class ProductOrder implements Serializable, Comparable<ProductOrder> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 1)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "promotion_value", precision = 21, scale = 2)
    private BigDecimal promotionValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "promotion_type")
    private ReductionType promotionType;

    @Column(name = "promo_code_value", precision = 21, scale = 2)
    private BigDecimal promoCodeValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "promo_code_type")
    private ReductionType promoCodeType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(
        value = {
            "category", "relatedCategories", "tags", "recipes", "associatedPromotions", "associatedPromotionalCodes", "favoritesOfs",
        },
        allowSetters = true
    )
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lines", "promotionalCode" }, allowSetters = true)
    private Order order;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public static ProductOrder fromProductCart(final ProductCart productCart) {
        final ProductOrder entity = new ProductOrder();
        entity.product = productCart.getProduct();
        entity.quantity = productCart.getQuantity();
        entity.price = entity.product.getPrice().multiply(BigDecimal.valueOf(entity.quantity));
        return entity;
    }

    public Long getId() {
        return this.id;
    }

    public ProductOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public ProductOrder quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public ProductOrder price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getPromotionValue() {
        return this.promotionValue;
    }

    public ProductOrder promotionValue(BigDecimal promotionValue) {
        this.setPromotionValue(promotionValue);
        return this;
    }

    public void setPromotionValue(BigDecimal promotionValue) {
        this.promotionValue = promotionValue;
    }

    public ReductionType getPromotionType() {
        return this.promotionType;
    }

    public ProductOrder promotionType(ReductionType promotionType) {
        this.setPromotionType(promotionType);
        return this;
    }

    public void setPromotionType(ReductionType promotionType) {
        this.promotionType = promotionType;
    }

    public BigDecimal getPromoCodeValue() {
        return this.promoCodeValue;
    }

    public ProductOrder promoCodeValue(BigDecimal promoCodeValue) {
        this.setPromoCodeValue(promoCodeValue);
        return this;
    }

    public void setPromoCodeValue(BigDecimal promoCodeValue) {
        this.promoCodeValue = promoCodeValue;
    }

    public ReductionType getPromoCodeType() {
        return this.promoCodeType;
    }

    public ProductOrder promoCodeType(ReductionType promoCodeType) {
        this.setPromoCodeType(promoCodeType);
        return this;
    }

    public void setPromoCodeType(ReductionType promoCodeType) {
        this.promoCodeType = promoCodeType;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductOrder product(Product product) {
        this.setProduct(product);
        return this;
    }

    public Order getOrder() {
        return this.order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public ProductOrder order(Order order) {
        this.setOrder(order);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductOrder)) {
            return false;
        }
        return id != null && id.equals(((ProductOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductOrder{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            "}";
    }

    @Override
    public int compareTo(ProductOrder o) {
        return this.product.getId().compareTo(o.getProduct().getId());
    }
}
