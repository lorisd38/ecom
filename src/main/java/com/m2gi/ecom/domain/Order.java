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
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "payment_date", nullable = false)
    private Instant paymentDate;

    @Column(name = "promo_code")
    private String promoCode;

    @NotNull
    @Column(name = "total_price", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = { "product", "order" }, allowSetters = true)
    private Set<ProductOrder> lines = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getPaymentDate() {
        return this.paymentDate;
    }

    public Order paymentDate(Instant paymentDate) {
        this.setPaymentDate(paymentDate);
        return this;
    }

    public void setPaymentDate(Instant paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPromoCode() {
        return this.promoCode;
    }

    public Order promoCode(String promoCode) {
        this.setPromoCode(promoCode);
        return this;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public BigDecimal getTotalPrice() {
        return this.totalPrice;
    }

    public Order totalPrice(BigDecimal totalPrice) {
        this.setTotalPrice(totalPrice);
        return this;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Set<ProductOrder> getLines() {
        return this.lines;
    }

    public void setLines(Set<ProductOrder> productOrders) {
        if (this.lines != null) {
            this.lines.forEach(i -> i.setOrder(null));
        }
        if (productOrders != null) {
            productOrders.forEach(i -> i.setOrder(this));
        }
        this.lines = productOrders;
    }

    public Order lines(Set<ProductOrder> productOrders) {
        this.setLines(productOrders);
        return this;
    }

    public Order addLines(ProductOrder productOrder) {
        this.lines.add(productOrder);
        productOrder.setOrder(this);
        return this;
    }

    public Order removeLines(ProductOrder productOrder) {
        this.lines.remove(productOrder);
        productOrder.setOrder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", paymentDate='" + getPaymentDate() + "'" +
            ", promoCode='" + getPromoCode() + "'" +
            ", totalPrice=" + getTotalPrice() +
            "}";
    }
}
