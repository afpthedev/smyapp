import React from 'react';

const SettingsPage = ({user}) => {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="user-info-card">
        <h3>Kullanıcı Bilgileri</h3>
        {user && (
          <div>
            <p><strong>Kullanıcı Adı:</strong> {user.login || user.username}</p>
            <p><strong>E-posta:</strong> {user.email || 'Belirtilmemiş'}</p>
            <p><strong>Ad
              Soyad:</strong> {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Belirtilmemiş'}
            </p>
            <p><strong>Dil:</strong> {user.langKey || 'tr'}</p>
            <p><strong>Yetkilendirmeler:</strong> {user.authorities ? user.authorities.join(', ') : 'Belirtilmemiş'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
