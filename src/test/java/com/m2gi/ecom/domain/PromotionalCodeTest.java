package com.m2gi.ecom.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.m2gi.ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PromotionalCodeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PromotionalCode.class);
        PromotionalCode promotionalCode1 = new PromotionalCode();
        promotionalCode1.setId(1L);
        PromotionalCode promotionalCode2 = new PromotionalCode();
        promotionalCode2.setId(promotionalCode1.getId());
        assertThat(promotionalCode1).isEqualTo(promotionalCode2);
        promotionalCode2.setId(2L);
        assertThat(promotionalCode1).isNotEqualTo(promotionalCode2);
        promotionalCode1.setId(null);
        assertThat(promotionalCode1).isNotEqualTo(promotionalCode2);
    }
}
