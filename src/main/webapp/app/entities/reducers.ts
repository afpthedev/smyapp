import appointment from 'app/entities/appointment/appointment.reducer';
import appointmentType from 'app/entities/appointment-type/appointment-type.reducer';
import notification from 'app/entities/notification/notification.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  appointment,
  appointmentType,
  notification,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
