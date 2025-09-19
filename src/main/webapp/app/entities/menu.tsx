import React from 'react';
// eslint-disable-line

import MenuItem from 'app/shared/layout/menus/menu-item'; // eslint-disable-line

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="calendar-alt" to="/appointment">
        Randevular
      </MenuItem>
      <MenuItem icon="calendar" to="/appointment/calendar">
        Takvim Görünümü
      </MenuItem>
      <MenuItem icon="tag" to="/appointment-type">
        Randevu Türleri
      </MenuItem>
      <MenuItem icon="bell" to="/notification">
        Bildirimler
      </MenuItem>
      <MenuItem icon="bell" to="/notification/center">
        Bildirim Merkezi
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
