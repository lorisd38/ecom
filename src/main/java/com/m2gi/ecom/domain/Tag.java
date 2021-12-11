package com.m2gi.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * A Tag.
 */
@Entity
@Table(name = "tag")
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "color")
    private String color;

    /**
     * FIXME: Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.
     */
    @ApiModelProperty(value = "FIXME: Only created because JHipster needs a bidirectional ManyToMany Relationship, should not be used.")
    @ManyToMany(mappedBy = "preferences", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "address", "user", "cart", "favorites", "preferences" }, allowSetters = true)
    private Set<UserDetails> preferencesOfs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tag id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Tag name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return this.color;
    }

    public Tag color(String color) {
        this.setColor(color);
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<UserDetails> getPreferencesOfs() {
        return this.preferencesOfs;
    }

    public void setPreferencesOfs(Set<UserDetails> userDetails) {
        if (this.preferencesOfs != null) {
            this.preferencesOfs.forEach(i -> i.removePreferences(this));
        }
        if (userDetails != null) {
            userDetails.forEach(i -> i.addPreferences(this));
        }
        this.preferencesOfs = userDetails;
    }

    public Tag preferencesOfs(Set<UserDetails> userDetails) {
        this.setPreferencesOfs(userDetails);
        return this;
    }

    public Tag addPreferencesOf(UserDetails userDetails) {
        this.preferencesOfs.add(userDetails);
        userDetails.getPreferences().add(this);
        return this;
    }

    public Tag removePreferencesOf(UserDetails userDetails) {
        this.preferencesOfs.remove(userDetails);
        userDetails.getPreferences().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tag)) {
            return false;
        }
        return id != null && id.equals(((Tag) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tag{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", color='" + getColor() + "'" +
            "}";
    }
}
