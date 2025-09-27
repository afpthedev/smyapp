package com.mycompany.reservation.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OfferedServiceDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OfferedServiceDTO.class);
        OfferedServiceDTO offeredServiceDTO1 = new OfferedServiceDTO();
        offeredServiceDTO1.setId(1L);
        OfferedServiceDTO offeredServiceDTO2 = new OfferedServiceDTO();
        assertThat(offeredServiceDTO1).isNotEqualTo(offeredServiceDTO2);
        offeredServiceDTO2.setId(offeredServiceDTO1.getId());
        assertThat(offeredServiceDTO1).isEqualTo(offeredServiceDTO2);
        offeredServiceDTO2.setId(2L);
        assertThat(offeredServiceDTO1).isNotEqualTo(offeredServiceDTO2);
        offeredServiceDTO1.setId(null);
        assertThat(offeredServiceDTO1).isNotEqualTo(offeredServiceDTO2);
    }
}
