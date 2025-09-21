import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faCheck, faTimes, faPlus} from '@fortawesome/free-solid-svg-icons';
import appointmentService from '../services/appointmentService';
import './CalendarPage.css';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    time: '',
    client: '',
    phone: '',
    status: 'pending',
    color: 'blue'
  });

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAllAppointments();

      if (response.success) {
        // Directly use the transformed data from service
        setAppointments(response.data);
      } else {
        setError(response.error || 'Randevular yüklenirken hata oluştu');
        // Fallback to demo data if backend is not available
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Randevular yüklenirken hata oluştu: ' + error.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    if (newAppointment.time && newAppointment.client) {
      try {
        setLoading(true);
        setError(null);

        // Prepare appointment data for backend
        const appointmentData = {
          title: newAppointment.client,
          description: newAppointment.phone || '',
          appointmentDate: new Date().toISOString(), // You might want to parse time properly
          duration: 60,
          status: 'PLANNED',
          type: null,
          participants: []
        };

        const response = await appointmentService.createAppointment(appointmentData);

        if (response.success) {
          // Directly use the transformed data from service
          setAppointments([...appointments, response.data]);
        } else {
          setError(response.error || 'Randevu eklenirken hata oluştu');
          // Fallback to local state update
          const appointment = {
            id: Date.now(),
            ...newAppointment
          };
          setAppointments([...appointments, appointment]);
        }

        // Reset form
        setNewAppointment({
          time: '',
          client: '',
          phone: '',
          status: 'pending',
          color: 'blue'
        });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding appointment:', error);
        setError('Randevu eklenirken hata oluştu: ' + error.message);

        // Fallback to local state update
        const appointment = {
          id: Date.now(),
          ...newAppointment
        };
        setAppointments([...appointments, appointment]);
        setNewAppointment({
          time: '',
          client: '',
          phone: '',
          status: 'pending',
          color: 'blue'
        });
        setShowAddForm(false);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Lütfen saat ve müşteri adı alanlarını doldurun');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      setLoading(true);
      const response = await appointmentService.deleteAppointment(id);

      if (response.success) {
        setAppointments(appointments.filter(app => app.id !== id));
      } else {
        setError(response.error || 'Randevu silinirken hata oluştu');
        // Fallback to local state update
        setAppointments(appointments.filter(app => app.id !== id));
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Randevu silinirken hata oluştu');
      // Fallback to local state update
      setAppointments(appointments.filter(app => app.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (id) => {
    setEditingId(id);
    const appointment = appointments.find(app => app.id === id);
    setNewAppointment(appointment);
  };

  const handleUpdateAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.updateAppointment(editingId, newAppointment);

      if (response.success) {
        // Transform and update local state
        const transformedAppointment = appointmentService.transformFromDTO(response.data);
        setAppointments(appointments.map(app =>
          app.id === editingId ? transformedAppointment : app
        ));
      } else {
        setError(response.error || 'Randevu güncellenirken hata oluştu');
        // Fallback to local state update
        setAppointments(appointments.map(app =>
          app.id === editingId ? {...newAppointment, id: editingId} : app
        ));
      }

      setEditingId(null);
      setNewAppointment({
        time: '',
        client: '',
        phone: '',
        status: 'pending',
        color: 'blue'
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Randevu güncellenirken hata oluştu');
      // Fallback to local state update
      setAppointments(appointments.map(app =>
        app.id === editingId ? {...newAppointment, id: editingId} : app
      ));
      setEditingId(null);
      setNewAppointment({
        time: '',
        client: '',
        phone: '',
        status: 'pending',
        color: 'blue'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const appointment = appointments.find(app => app.id === id);
      const updatedAppointment = {...appointment, status: newStatus};

      const response = await appointmentService.updateAppointment(id, updatedAppointment);

      if (response.success) {
        const transformedAppointment = appointmentService.transformFromDTO(response.data);
        setAppointments(appointments.map(app =>
          app.id === id ? transformedAppointment : app
        ));
      } else {
        setError(response.error || 'Randevu durumu güncellenirken hata oluştu');
        // Fallback to local state update
        setAppointments(appointments.map(app =>
          app.id === id ? {...app, status: newStatus} : app
        ));
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Randevu durumu güncellenirken hata oluştu');
      // Fallback to local state update
      setAppointments(appointments.map(app =>
        app.id === id ? {...app, status: newStatus} : app
      ));
    }
  };
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <div className="calendar-controls">
          <button className="calendar-view-btn active">Week</button>
          <button className="calendar-view-btn">Day</button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#c33',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-indicator" style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Yükleniyor...
        </div>
      )}

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-nav">
            <button className="nav-btn">‹</button>
            <h2>Today's Appointments</h2>
            <button className="nav-btn">›</button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-sidebar">
            <div className="artist-profile">
              <div className="artist-avatar">
                <span>AV</span>
              </div>
              <h3>Alex Volkov</h3>
              <p>Realism & Blackwork</p>
            </div>

            <div className="artist-profile">
              <div className="artist-avatar">
                <span>RB</span>
              </div>
              <h3>Raven Blackwood</h3>
              <p>Neo-Traditional</p>
            </div>

            <div className="artist-profile">
              <div className="artist-avatar">
                <span>JT</span>
              </div>
              <h3>Jax Teller</h3>
              <p>American Traditional</p>
            </div>
          </div>

          <div className="calendar-main">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-slot">
                <div className={`appointment-card ${appointment.color}`}>
                  <div className="appointment-time">{appointment.time}</div>
                  <div className="appointment-client">{appointment.client}</div>
                  <div className="appointment-type">{appointment.type}</div>
                  <div className="appointment-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditAppointment(appointment.id)}
                      title="Düzenle"
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      title="Sil"
                    >
                      <FontAwesomeIcon icon={faTrash}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="appointments-sidebar">
            <h3>Today's Appointments</h3>

            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-avatar">
                  <span>{appointment.client.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="appointment-info">
                  <h4>{appointment.client}</h4>
                  <p>{appointment.phone}</p>
                  <span className={`appointment-status ${appointment.status}`}>
                    {appointment.status === 'approved' ? 'Onaylandı' :
                      appointment.status === 'pending' ? 'Bekliyor' : 'İptal Edildi'}
                  </span>
                </div>
                <div className="appointment-actions">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleStatusChange(appointment.id, 'approved')}
                        title="Onayla"
                      >
                        <FontAwesomeIcon icon={faCheck}/>
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => handleStatusChange(appointment.id, 'canceled')}
                        title="İptal Et"
                      >
                        <FontAwesomeIcon icon={faTimes}/>
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditAppointment(appointment.id)}
                    title="Düzenle"
                  >
                    <FontAwesomeIcon icon={faEdit}/>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    title="Sil"
                  >
                    <FontAwesomeIcon icon={faTrash}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="add-appointment">
        <button
          className="add-appointment-btn"
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus}/> Yeni Randevu Ekle
        </button>
      </div>

      {/* Add/Edit Appointment Modal */}
      {(showAddForm || editingId) && (
        <div className="appointment-modal">
          <div className="modal-content">
            <h3>{editingId ? 'Randevu Düzenle' : 'Yeni Randevu Ekle'}</h3>
            <div className="form-group">
              <label>Saat:</label>
              <input
                type="text"
                placeholder="Örn: 10:00 - 12:00"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Müşteri Adı:</label>
              <input
                type="text"
                placeholder="Müşteri adını girin"
                value={newAppointment.client}
                onChange={(e) => setNewAppointment({...newAppointment, client: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={newAppointment.phone}
                onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Durum:</label>
              <select
                value={newAppointment.status}
                onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
              >
                <option value="pending">Bekliyor</option>
                <option value="approved">Onaylandı</option>
                <option value="canceled">İptal Edildi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Renk:</label>
              <select
                value={newAppointment.color}
                onChange={(e) => setNewAppointment({...newAppointment, color: e.target.value})}
              >
                <option value="blue">Mavi</option>
                <option value="purple">Mor</option>
                <option value="pink">Pembe</option>
                <option value="green">Yeşil</option>
                <option value="orange">Turuncu</option>
                <option value="red">Kırmızı</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={editingId ? handleUpdateAppointment : handleAddAppointment}
              >
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setNewAppointment({
                    time: '',
                    client: '',
                    phone: '',
                    status: 'pending',
                    color: 'blue'
                  });
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;  