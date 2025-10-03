import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Settings as SettingsIcon,
  Palette,
  Shield,
  Database,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Save,
  CheckCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user-management' | 'system-config' | 'customization'>('user-management');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; show: boolean }>({
    type: 'success',
    message: '',
    show: false
  });

  // Mock settings data - in real app, this would come from API
  const [settings, setSettings] = useState({
    userManagement: {
      adminRoles: ['Super Admin', 'Admin', 'Moderator'],
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    systemConfig: {
      databaseBackup: {
        enabled: true,
        frequency: 'daily',
        retentionDays: 30
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      },
      apiIntegrations: {
        googleCalendar: false,
        slack: false,
        emailService: 'smtp'
      }
    },
    customization: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC+5:30',
      dashboardLayout: 'grid',
      dateFormat: 'DD/MM/YYYY'
    }
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleSave = (section: string) => {
    // In real app, this would make API call
    showNotification('success', `${section} settings saved successfully!`);
  };

  const tabs = [
    {
      id: 'user-management' as const,
      label: 'User Management',
      icon: Users,
      description: 'Manage admin roles, permissions, and security policies'
    },
    {
      id: 'system-config' as const,
      label: 'System Configuration',
      icon: SettingsIcon,
      description: 'Configure system backups, notifications, and integrations'
    },
    {
      id: 'customization' as const,
      label: 'Customization',
      icon: Palette,
      description: 'Customize theme, language, and dashboard preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fffcf2]">
      {/* Header */}
      <header className="bg-[#252422] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-2 text-[#ccc5b9] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <CheckCircle size={20} />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-[#ccc5b9]">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-[#eb5e28] text-[#eb5e28]'
                        : 'border-transparent text-[#252422] hover:text-[#eb5e28] hover:border-[#eb5e28]'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* User Management Tab */}
          {activeTab === 'user-management' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#252422] mb-2">User Management</h2>
                <p className="text-[#ccc5b9]">Configure admin roles, permissions, and security policies</p>
              </div>

              <div className="space-y-8">
                {/* Admin Roles */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Admin Roles & Permissions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {settings.userManagement.adminRoles.map((role, index) => (
                      <div key={role} className="border border-[#ccc5b9] rounded-lg p-4">
                        <h4 className="font-medium text-[#252422]">{role}</h4>
                        <p className="text-sm text-[#ccc5b9] mt-1">
                          {index === 0 ? 'Full system access' :
                           index === 1 ? 'Standard admin access' :
                           'Limited moderation access'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Policy */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4">Password Policy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Minimum Length
                      </label>
                      <input
                        type="number"
                        value={settings.userManagement.passwordPolicy.minLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          userManagement: {
                            ...settings.userManagement,
                            passwordPolicy: {
                              ...settings.userManagement.passwordPolicy,
                              minLength: parseInt(e.target.value)
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.userManagement.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          userManagement: {
                            ...settings.userManagement,
                            sessionTimeout: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {Object.entries(settings.userManagement.passwordPolicy)
                      .filter(([key]) => key !== 'minLength')
                      .map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            userManagement: {
                              ...settings.userManagement,
                              passwordPolicy: {
                                ...settings.userManagement.passwordPolicy,
                                [key]: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-[#252422]">
                          Require {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ccc5b9]">
                <button
                  onClick={() => handleSave('User Management')}
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save User Management Settings
                </button>
              </div>
            </div>
          )}

          {/* System Configuration Tab */}
          {activeTab === 'system-config' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#252422] mb-2">System Configuration</h2>
                <p className="text-[#ccc5b9]">Configure system backups, notifications, and integrations</p>
              </div>

              <div className="space-y-8">
                {/* Database Backup */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4 flex items-center">
                    <Database className="mr-2" size={20} />
                    Database Backup
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Backup Enabled
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.systemConfig.databaseBackup.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            systemConfig: {
                              ...settings.systemConfig,
                              databaseBackup: {
                                ...settings.systemConfig.databaseBackup,
                                enabled: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-[#252422]">Enable automatic backups</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Frequency
                      </label>
                      <select
                        value={settings.systemConfig.databaseBackup.frequency}
                        onChange={(e) => setSettings({
                          ...settings,
                          systemConfig: {
                            ...settings.systemConfig,
                            databaseBackup: {
                              ...settings.systemConfig.databaseBackup,
                              frequency: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Retention (days)
                      </label>
                      <input
                        type="number"
                        value={settings.systemConfig.databaseBackup.retentionDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          systemConfig: {
                            ...settings.systemConfig,
                            databaseBackup: {
                              ...settings.systemConfig.databaseBackup,
                              retentionDays: parseInt(e.target.value)
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4 flex items-center">
                    <Bell className="mr-2" size={20} />
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(settings.systemConfig.notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            systemConfig: {
                              ...settings.systemConfig,
                              notifications: {
                                ...settings.systemConfig.notifications,
                                [key]: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-[#252422]">
                          Enable {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ccc5b9]">
                <button
                  onClick={() => handleSave('System Configuration')}
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save System Configuration
                </button>
              </div>
            </div>
          )}

          {/* Customization Tab */}
          {activeTab === 'customization' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#252422] mb-2">Customization</h2>
                <p className="text-[#ccc5b9]">Customize theme, language, and dashboard preferences</p>
              </div>

              <div className="space-y-8">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4 flex items-center">
                    <Palette className="mr-2" size={20} />
                    Theme & Appearance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.customization.theme}
                        onChange={(e) => setSettings({
                          ...settings,
                          customization: {
                            ...settings.customization,
                            theme: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Dashboard Layout
                      </label>
                      <select
                        value={settings.customization.dashboardLayout}
                        onChange={(e) => setSettings({
                          ...settings,
                          customization: {
                            ...settings.customization,
                            dashboardLayout: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="compact">Compact</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language & Localization */}
                <div>
                  <h3 className="text-lg font-medium text-[#252422] mb-4 flex items-center">
                    <Globe className="mr-2" size={20} />
                    Language & Localization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Language
                      </label>
                      <select
                        value={settings.customization.language}
                        onChange={(e) => setSettings({
                          ...settings,
                          customization: {
                            ...settings.customization,
                            language: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.customization.timezone}
                        onChange={(e) => setSettings({
                          ...settings,
                          customization: {
                            ...settings.customization,
                            timezone: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="UTC+5:30">IST (UTC+5:30)</option>
                        <option value="UTC+0">GMT (UTC+0)</option>
                        <option value="UTC-5">EST (UTC-5)</option>
                        <option value="UTC+1">CET (UTC+1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#252422] mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.customization.dateFormat}
                        onChange={(e) => setSettings({
                          ...settings,
                          customization: {
                            ...settings.customization,
                            dateFormat: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] bg-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ccc5b9]">
                <button
                  onClick={() => handleSave('Customization')}
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Customization Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;