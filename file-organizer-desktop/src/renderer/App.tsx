import React, { useState, useEffect } from 'react';
import { EnvironmentSetup } from './components/Setup/EnvironmentSetup';
import { FileUploader } from './components/Upload/FileUploader';
import { Toast } from './components/Common/Toast';
import { StorageConfig } from '../types';
import { useStorage } from './hooks/useStorage';
import './styles/global.css';

const App: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const { storageConfig, saveStorageConfig } = useStorage();

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const config = await window.electronAPI.getStorageConfig();
      if (config && config.isConfigured) {
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Error checking configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (config: StorageConfig) => {
    const success = await saveStorageConfig(config);
    if (success) {
      setIsConfigured(true);
      window.electronAPI.showToast('Storage configured successfully!', 'success');
    } else {
      window.electronAPI.showToast('Failed to save configuration', 'error');
    }
  };

  const handleChangeLocation = () => {
    setIsConfigured(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading File Organizer...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗂️ Intelligent File Organizer</h1>
        <p>Automatically organize your files into smart folders</p>
      </header>

      <main className="app-main">
        {!isConfigured ? (
          <EnvironmentSetup onSetupComplete={handleSetupComplete} />
        ) : (
          <FileUploader 
            storageConfig={storageConfig}
            onChangeLocation={handleChangeLocation}
          />
        )}
      </main>

      <Toast />
    </div>
  );
};

export default App;
