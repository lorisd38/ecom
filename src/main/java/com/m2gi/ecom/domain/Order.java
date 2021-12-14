package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

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

    @NotNull
    @Column(name = "reception_date", nullable = false)
    private Instant receptionDate;

    @NotNull
    @Column(name = "total_price", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "product", "order" }, allowSetters = true)
    private Set<ProductOrder> lines = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private PromotionalCode promotionalCode;

    @ManyToOne
    @JsonIgnoreProperties(value = { "address", "user", "cart", "orders", "favorites", "preferences" }, allowSetters = true)
    private UserDetails user;

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

    public Instant getReceptionDate() {
        return this.receptionDate;
    }

    public Order receptionDate(Instant receptionDate) {
        this.setReceptionDate(receptionDate);
        return this;
    }

    public void setReceptionDate(Instant receptionDate) {
        this.receptionDate = receptionDate;
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

    public PromotionalCode getPromotionalCode() {
        return this.promotionalCode;
    }

    public void setPromotionalCode(PromotionalCode promotionalCode) {
        this.promotionalCode = promotionalCode;
    }

    public Order promotionalCode(PromotionalCode promotionalCode) {
        this.setPromotionalCode(promotionalCode);
        return this;
    }

    public UserDetails getUser() {
        return this.user;
    }

    public void setUser(UserDetails userDetails) {
        this.user = userDetails;
    }

    public Order user(UserDetails userDetails) {
        this.setUser(userDetails);
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
            ", receptionDate='" + getReceptionDate() + "'" +
            ", totalPrice=" + getTotalPrice() +
            "}";
    }
}
