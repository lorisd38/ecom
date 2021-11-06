package com.m2gi.ecom.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.m2gi.ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductCartTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductCart.class);
        ProductCart productCart1 = new ProductCart();
        productCart1.setId(1L);
        ProductCart productCart2 = new ProductCart();
        productCart2.setId(productCart1.getId());
        assertThat(productCart1).isEqualTo(productCart2);
        productCart2.setId(2L);
        assertThat(productCart1).isNotEqualTo(productCart2);
        productCart1.setId(null);
        assertThat(productCart1).isNotEqualTo(productCart2);
    }
}
