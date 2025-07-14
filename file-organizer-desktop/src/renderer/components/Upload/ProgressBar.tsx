import React from 'react';
import { ProcessingStats } from '../../../types';

interface Props {
  stats: ProcessingStats;
  isProcessing: boolean;
}

export const ProgressBar: React.FC<Props> = ({ stats, isProcessing }) => {
  const progressPercentage = stats.total > 0 ? (stats.processed / stats.total) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h4>Processing Files</h4>
        <span className="progress-text">
          {stats.processed} of {stats.total} files processed
        </span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="progress-percentage">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      <div className="progress-details">
        <div className="detail-item">
          <span className="detail-icon">✅</span>
          <span>Success: {stats.success}</span>
        </div>
        {stats.errors > 0 && (
          <div className="detail-item error">
            <span className="detail-icon">❌</span>
            <span>Errors: {stats.errors}</span>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <span>Organizing files...</span>
        </div>
      )}
    </div>
  );
};