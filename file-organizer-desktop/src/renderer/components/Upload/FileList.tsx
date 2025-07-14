import React from 'react';
import { FileItem } from '../../../types';

interface Props {
  files: FileItem[];
}

export const FileList: React.FC<Props> = ({ files }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileItem['status']): string => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getStatusColor = (status: FileItem['status']): string => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'success': return 'status-success';
      case 'error': return 'status-error';
      default: return 'status-pending';
    }
  };

  const getFolderIcon = (folderName: string): string => {
    const folderIcons: { [key: string]: string } = {
      'Videos': '🎥',
      'Images': '🖼️',
      'PDFs': '📄',
      'Excel': '📊',
      'Word': '📝',
      'PowerPoint': '📈',
      'ZIP': '🗜️',
      'Audio': '🎵',
      'Text': '📋',
      'Others': '📁'
    };
    return folderIcons[folderName] || '📁';
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <h4>📋 Files to Organize ({files.length})</h4>
      </div>
      
      <div className="file-list-container">
        {files.map((file) => (
          <div key={file.id} className={`file-item ${getStatusColor(file.status)}`}>
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <div className="file-name" title={file.name}>
                  {file.name}
                </div>
                <div className="file-meta">
                  <span className="file-size">{formatFileSize(file.size)}</span>
                  <span className="file-type">{file.extension.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="file-target">
              <div className="target-folder">
                <span className="folder-icon">
                  {getFolderIcon(file.targetFolder)}
                </span>
                <span className="folder-name">{file.targetFolder}</span>
              </div>
            </div>

            <div className="file-status">
              <span className="status-icon">{getStatusIcon(file.status)}</span>
              <span className="status-text">{file.status}</span>
              {file.error && (
                <div className="error-message" title={file.error}>
                  {file.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};