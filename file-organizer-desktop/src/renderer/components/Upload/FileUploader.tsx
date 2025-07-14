import React, { useState, useCallback, useRef } from 'react';
import { FileItem, StorageConfig, ProcessingStats } from '../../../types';
import { ProgressBar } from './ProgressBar';
import { FileList } from './FileList';
import { Button } from '../Common/Button';
import { useFileUpload } from '../../hooks/useFileUpload';

interface Props {
  storageConfig: StorageConfig | null;
  onChangeLocation: () => void;
}

export const FileUploader: React.FC<Props> = ({ storageConfig, onChangeLocation }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    files, 
    stats, 
    isProcessing, 
    addFiles, 
    processFiles, 
    clearFiles 
  } = useFileUpload();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [addFiles]);

  const handleProcessFiles = useCallback(async () => {
    if (!storageConfig) {
      window.electronAPI.showToast('Storage not configured', 'error');
      return;
    }
    // Pass the basePath or the appropriate string property
    await processFiles(storageConfig.basePath); // Adjust according to your actual type definition
  }, [processFiles, storageConfig]);

  return (
    <div className="file-uploader">
      {/* Header */}
      <div className="uploader-header">
        <div className="storage-info">
          <h3>📁 Storage Location</h3>
          <p className="storage-path">{storageConfig?.basePath || 'Not configured'}</p>
          <Button 
            onClick={onChangeLocation} 
            variant="secondary"
          >
            Change Location
          </Button>
        </div>
      </div>

      {/* Drop Zone */}
      <div 
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <div className="drop-zone-content">
          <div className="drop-zone-icon">📁</div>
          <h3>Drop files here or click to select</h3>
          <p>Select up to 30 files to organize automatically</p>
          <Button variant="primary" className="select-files-btn">
            Select Files
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {(files.length > 0 || isProcessing) && (
        <ProgressBar stats={stats} isProcessing={isProcessing} />
      )}

      {/* File List */}
      {files.length > 0 && (
        <FileList files={files} />
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="action-buttons">
          <Button 
            onClick={clearFiles} 
            variant="secondary"
            disabled={isProcessing}
          >
            Clear All
          </Button>
          <Button 
            onClick={handleProcessFiles}
            variant="success"
            disabled={isProcessing || files.length === 0}
            loading={isProcessing}
          >
            {isProcessing ? 'Organizing Files...' : `Organize ${files.length} Files`}
          </Button>
        </div>
      )}

      {/* Stats Summary */}
      {stats.total > 0 && (
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Processed:</span>
            <span className="stat-value">{stats.processed}</span>
          </div>
          <div className="stat-item success">
            <span className="stat-label">Success:</span>
            <span className="stat-value">{stats.success}</span>
          </div>
          {stats.errors > 0 && (
            <div className="stat-item error">
              <span className="stat-label">Errors:</span>
              <span className="stat-value">{stats.errors}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
