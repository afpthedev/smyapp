import React from 'react';

const DashboardPage = ({clients}) => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Toplam Müşteriler</h3>
          <p className="stat-number">{clients ? clients.length : 0}</p>
        </div>
        <div className="stat-card">
          <h3>Bu Ay Randevular</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-card">
          <h3>Gelir</h3>
          <p className="stat-number">₺2,450</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
