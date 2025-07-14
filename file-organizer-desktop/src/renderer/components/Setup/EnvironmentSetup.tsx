import React, { useState } from 'react';
import { StorageConfig } from '../../../types';
import { FolderPreview } from './FolderPreview';
import { Button } from '../Common/Button';

interface Props {
  onSetupComplete: (config: StorageConfig) => void;
}

export const EnvironmentSetup: React.FC<Props> = ({ onSetupComplete }) => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectFolder = async () => {
    try {
      const path = await window.electronAPI.selectFolder();
      if (path) {
        setSelectedPath(path);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      window.electronAPI.showToast('Failed to select folder', 'error');
    }
  };

  const handleConfirmSetup = async () => {
    if (!selectedPath) {
      window.electronAPI.showToast('Please select a storage path', 'error');
      return;
    }

    setIsCreating(true);
    
    try {
      const folderNames = [
        'Videos', 'Images', 'PDFs', 'Excel', 'Word', 
        'PowerPoint', 'ZIP', 'Audio', 'Text', 'Others'
      ];

      const success = await window.electronAPI.createFolders(selectedPath, folderNames);
      
      if (success) {
        const config: StorageConfig = {
          basePath: selectedPath,
          folders: [], // Will be populated by StorageService
          isConfigured: true
        };
        
        onSetupComplete(config);
      } else {
        window.electronAPI.showToast('Failed to create folders', 'error');
      }
    } catch (error) {
      console.error('Error during setup:', error);
      window.electronAPI.showToast('Setup failed', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2>🛠️ Environment Setup</h2>
        <p className="setup-description">
          Choose where you want to store your organized files. 
          This folder will contain all your sorted documents.
        </p>

        <div className="path-selector">
          <input
            type="text"
            value={selectedPath}
            placeholder="Select your storage folder path..."
            readOnly
            className="path-input"
          />
          <Button onClick={handleSelectFolder} variant="primary">
            📁 Browse Folder
          </Button>
        </div>

        <FolderPreview />

        <Button
          onClick={handleConfirmSetup}
          variant="success"
          disabled={!selectedPath || isCreating}
          loading={isCreating}
          className="confirm-button"
        >
          {isCreating ? 'Creating Folders...' : '✅ Confirm Setup & Create Folders'}
        </Button>
      </div>
    </div>
  );
};