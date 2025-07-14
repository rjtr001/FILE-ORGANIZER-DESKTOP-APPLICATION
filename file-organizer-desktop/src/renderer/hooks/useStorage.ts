import { useState, useEffect } from 'react';
import { StorageConfig } from '../../types';

export const useStorage = () => {
  const [storageConfig, setStorageConfig] = useState<StorageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageConfig();
  }, []);

  const loadStorageConfig = async () => {
    try {
      const config = await window.electronAPI.getStorageConfig();
      setStorageConfig(config);
    } catch (error) {
      console.error('Error loading storage config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStorageConfig = async (config: StorageConfig): Promise<boolean> => {
    try {
      const success = await window.electronAPI.saveStorageConfig(config);
      if (success) {
        setStorageConfig(config);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving storage config:', error);
      return false;
    }
  };

  return {
    storageConfig,
    loading,
    saveStorageConfig,
    reloadConfig: loadStorageConfig,
  };
};