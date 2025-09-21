import React, {useState} from 'react';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Liam Carter',
      phone: '(555) 123-4567',
      email: 'liam.carter@email.com',
      appointments: 3,
      lastAppointment: '2023-11-15'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      phone: '(555) 987-6543',
      email: 'olivia.bennett@email.com',
      appointments: 2,
      lastAppointment: '2023-10-20'
    },
    {
      id: 3,
      name: 'Ethan Harper',
      phone: '(555) 246-8013',
      email: 'ethan.harper@email.com',
      appointments: 1,
      lastAppointment: '2023-09-05'
    },
    {
      id: 4,
      name: 'Sophia Evans',
      phone: '(555) 135-7924',
      email: 'sophia.evans@email.com',
      appointments: 4,
      lastAppointment: '2023-12-01'
    },
    {
      id: 5,
      name: 'Noah Foster',
      phone: '(555) 369-1212',
      email: 'noah.foster@email.com',
      appointments: 2,
      lastAppointment: '2023-11-28'
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1>Clients</h1>
        <button className="new-client-btn">
          + New Client
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search clients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Appointments</th>
            <th>Last Appointment</th>
          </tr>
          </thead>
          <tbody>
          {filteredClients.map(client => (
            <tr key={client.id}>
              <td className="client-name">{client.name}</td>
              <td className="client-phone">{client.phone}</td>
              <td className="client-email">{client.email}</td>
              <td className="client-appointments">{client.appointments}</td>
              <td className="client-last-appointment">{client.lastAppointment}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
