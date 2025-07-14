import React from 'react';

const folders = [
  { name: 'Videos', icon: '🎥', extensions: ['mp4', 'avi', 'mkv', 'mov'] },
  { name: 'Images', icon: '🖼️', extensions: ['jpg', 'png', 'gif', 'svg'] },
  { name: 'PDFs', icon: '📄', extensions: ['pdf'] },
  { name: 'Excel', icon: '📊', extensions: ['xlsx', 'xls', 'csv'] },
  { name: 'Word', icon: '📝', extensions: ['docx', 'doc', 'rtf'] },
  { name: 'PowerPoint', icon: '📈', extensions: ['pptx', 'ppt'] },
  { name: 'ZIP', icon: '🗜️', extensions: ['zip', 'rar', '7z'] },
  { name: 'Audio', icon: '🎵', extensions: ['mp3', 'wav', 'flac'] },
  { name: 'Text', icon: '📋', extensions: ['txt', 'md', 'json'] },
  { name: 'Others', icon: '📁', extensions: ['other files'] },
];

export const FolderPreview: React.FC = () => {
  return (
    <div className="folder-preview">
      <h3>📁 Folders that will be created:</h3>
      <div className="folder-grid">
        {folders.map(folder => (
          <div key={folder.name} className="folder-item" title={folder.extensions.join(', ')}>
            <span className="folder-icon">{folder.icon}</span>
            <span>{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
