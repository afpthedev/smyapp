import apiService from './api';

class AppointmentService {
  // Backend'den gelen AppointmentDTO'yu frontend formatına dönüştür
  transformFromDTO(appointmentDTO) {
    return {
      id: appointmentDTO.id,
      title: appointmentDTO.title,
      description: appointmentDTO.description,
      appointmentDate: appointmentDTO.appointmentDate,
      duration: appointmentDTO.duration,
      status: appointmentDTO.status,
      createdDate: appointmentDTO.createdDate,
      lastModifiedDate: appointmentDTO.lastModifiedDate,
      createdBy: appointmentDTO.createdBy,
      type: appointmentDTO.type,
      participants: appointmentDTO.participants || [],

      // Frontend için ek alanlar (eski format ile uyumluluk)
      time: appointmentDTO.appointmentDate ? new Date(appointmentDTO.appointmentDate).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      }) : '',
      client: appointmentDTO.participants && appointmentDTO.participants.length > 0 ? appointmentDTO.participants[0].firstName + ' ' + appointmentDTO.participants[0].lastName : appointmentDTO.title,
      phone: appointmentDTO.participants && appointmentDTO.participants.length > 0 ? appointmentDTO.participants[0].email : '',
      color: this.getColorFromStatus(appointmentDTO.status)
    };
  }

  // Frontend formatını backend AppointmentDTO'ya dönüştür
  transformToDTO(appointment) {
    // appointmentDate'i doğru formatta gönder
    let appointmentDate = appointment.appointmentDate;
    if (appointment.date && appointment.time) {
      // Eğer ayrı date ve time varsa birleştir
      const dateStr = appointment.date;
      const timeStr = appointment.time;
      appointmentDate = `${dateStr}T${timeStr}:00`;
    } else if (appointment.appointmentDate) {
      // Mevcut appointmentDate'i kullan
      appointmentDate = new Date(appointment.appointmentDate).toISOString();
    } else {
      // Varsayılan olarak şu anki zamanı kullan
      appointmentDate = new Date().toISOString();
    }

    return {
      id: appointment.id,
      title: appointment.title || appointment.client || 'Randevu',
      description: appointment.description || appointment.notes || '',
      appointmentDate: appointmentDate,
      duration: parseInt(appointment.duration) || 60,
      status: appointment.status || 'PLANNED',
      type: appointment.type && typeof appointment.type === 'object' ? appointment.type :
        appointment.type ? {id: null, name: appointment.type} : null,
      participants: appointment.participants || []
    };
  }

  // Status'a göre renk belirle
  getColorFromStatus(status) {
    switch (status) {
      case 'PLANNED':
        return 'blue';
      case 'CONFIRMED':
        return 'green';
      case 'COMPLETED':
        return 'purple';
      case 'CANCELLED':
        return 'red';
      default:
        return 'gray';
    }
  }

  // Tüm randevuları getir
  async getAllAppointments() {
    try {
      const response = await apiService.get('/appointments');
      return response.map(dto => this.transformFromDTO(dto));
    } catch (error) {
      console.error('Randevular getirilirken hata:', error);
      throw error;
    }
  }

  // ID'ye göre randevu getir
  async getAppointmentById(id) {
    try {
      const response = await apiService.get(`/appointments/${id}`);
      return this.transformFromDTO(response);
    } catch (error) {
      console.error('Randevu getirilirken hata:', error);
      throw error;
    }
  }

  // Yeni randevu oluştur
  async createAppointment(appointment) {
    try {
      const dto = this.transformToDTO(appointment);
      const response = await apiService.post('/appointments', dto);
      return this.transformFromDTO(response);
    } catch (error) {
      console.error('Randevu oluşturulurken hata:', error);
      throw error;
    }
  }

  // Randevu güncelle
  async updateAppointment(id, appointment) {
    try {
      const dto = this.transformToDTO(appointment);
      dto.id = id;
      const response = await apiService.put(`/appointments/${id}`, dto);
      return this.transformFromDTO(response);
    } catch (error) {
      console.error('Randevu güncellenirken hata:', error);
      throw error;
    }
  }

  // Randevu sil
  async deleteAppointment(id) {
    try {
      await apiService.delete(`/appointments/${id}`);
      return true;
    } catch (error) {
      console.error('Randevu silinirken hata:', error);
      throw error;
    }
  }

  // Randevu durumunu güncelle
  async updateAppointmentStatus(id, status) {
    try {
      const response = await apiService.put(`/appointments/${id}/status`, {status});
      return this.transformFromDTO(response);
    } catch (error) {
      console.error('Randevu durumu güncellenirken hata:', error);
      throw error;
    }
  }
}

export default new AppointmentService();
