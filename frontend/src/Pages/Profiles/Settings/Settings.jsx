import './Settings.css';
import { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { FaUser, FaBell, FaLock, FaPalette, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const { name, email, userRole, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifSettings, setNotifSettings] = useState({
    emailNotifs: true,
    appointmentReminders: true,
    reportAlerts: true,
    marketingEmails: false,
  });
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showToast(`Theme changed to ${newTheme}`);
  };

  const handleNotifChange = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification preference updated');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { key: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { key: 'security', label: 'Security', icon: <FaLock /> },
    { key: 'privacy', label: 'Privacy', icon: <FaShieldAlt /> },
  ];

  return (
    <div className='settings'>
      {toast && <div className="settings-toast">{toast}</div>}
      <h2 className="settings-title">⚙️ Settings</h2>
      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
          <button className="settings-tab logout-tab" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              <div className="settings-form">
                <div className="form-row">
                  <label>Full Name</label>
                  <input type="text" defaultValue={name || ''} placeholder="Your name" />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input type="email" defaultValue={email || ''} placeholder="Your email" readOnly />
                </div>
                <div className="form-row">
                  <label>Role</label>
                  <input type="text" value={userRole || 'N/A'} readOnly className="readonly-input" />
                </div>
                <button className="save-btn" onClick={() => showToast('Profile updated successfully!')}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="toggle-list">
                <div className="toggle-row">
                  <div>
                    <strong>Email Notifications</strong>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifSettings.emailNotifs} onChange={() => handleNotifChange('emailNotifs')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>Appointment Reminders</strong>
                    <p>Get reminders before appointments</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifSettings.appointmentReminders} onChange={() => handleNotifChange('appointmentReminders')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>Report Alerts</strong>
                    <p>Notify when AI reports are ready</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifSettings.reportAlerts} onChange={() => handleNotifChange('reportAlerts')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>Marketing Emails</strong>
                    <p>Receive promotional content</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifSettings.marketingEmails} onChange={() => handleNotifChange('marketingEmails')} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <p className="section-desc">Choose your preferred theme</p>
              <div className="theme-options">
                <div className={`theme-card ${theme === 'light' ? 'selected' : ''}`} onClick={() => handleThemeChange('light')}>
                  <div className="theme-preview light-preview">
                    <div className="preview-header"></div>
                    <div className="preview-body">
                      <div className="preview-sidebar"></div>
                      <div className="preview-content"></div>
                    </div>
                  </div>
                  <span>Light Mode ☀️</span>
                </div>
                <div className={`theme-card ${theme === 'dark' ? 'selected' : ''}`} onClick={() => handleThemeChange('dark')}>
                  <div className="theme-preview dark-preview">
                    <div className="preview-header"></div>
                    <div className="preview-body">
                      <div className="preview-sidebar"></div>
                      <div className="preview-content"></div>
                    </div>
                  </div>
                  <span>Dark Mode 🌙</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security</h3>
              <div className="settings-form">
                <div className="form-row">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="form-row">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="form-row">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button className="save-btn" onClick={() => showToast('Password change feature coming soon!')}>Update Password</button>
              </div>
              <div className="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account.</p>
                <button className="secondary-btn" onClick={() => showToast('2FA setup coming soon!')}>Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy & Data</h3>
              <div className="toggle-list">
                <div className="toggle-row">
                  <div>
                    <strong>Profile Visibility</strong>
                    <p>Allow others to see your profile</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>Data Analytics</strong>
                    <p>Allow anonymous usage data collection</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p>Permanently delete your account and all associated data.</p>
                <button className="danger-btn" onClick={() => showToast('Account deletion is not available in demo mode')}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;