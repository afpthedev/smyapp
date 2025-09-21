package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppointmentTypeDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppointmentTypeDTO.class);
        AppointmentTypeDTO appointmentTypeDTO1 = new AppointmentTypeDTO();
        appointmentTypeDTO1.setId(1L);
        AppointmentTypeDTO appointmentTypeDTO2 = new AppointmentTypeDTO();
        assertThat(appointmentTypeDTO1).isNotEqualTo(appointmentTypeDTO2);
        appointmentTypeDTO2.setId(appointmentTypeDTO1.getId());
        assertThat(appointmentTypeDTO1).isEqualTo(appointmentTypeDTO2);
        appointmentTypeDTO2.setId(2L);
        assertThat(appointmentTypeDTO1).isNotEqualTo(appointmentTypeDTO2);
        appointmentTypeDTO1.setId(null);
        assertThat(appointmentTypeDTO1).isNotEqualTo(appointmentTypeDTO2);
    }
}
