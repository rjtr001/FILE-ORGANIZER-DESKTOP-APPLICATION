import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import { StorageConfig, FolderConfig } from '../../types';

export class StorageService {
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'storage-config.json');
  }

  public async getConfig(): Promise<StorageConfig | null> {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public async saveConfig(config: StorageConfig): Promise<boolean> {
    try {
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  public getDefaultFolders(): FolderConfig[] {
    return [
      { name: 'Videos', icon: '🎥', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'] },
      { name: 'Images', icon: '🖼️', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'] },
      { name: 'PDFs', icon: '📄', extensions: ['pdf'] },
      { name: 'Excel', icon: '📊', extensions: ['xlsx', 'xls', 'xlsm', 'csv'] },
      { name: 'Word', icon: '📝', extensions: ['docx', 'doc', 'rtf'] },
      { name: 'PowerPoint', icon: '📈', extensions: ['pptx', 'ppt'] },
      { name: 'ZIP', icon: '🗜️', extensions: ['zip', 'rar', '7z', 'tar', 'gz'] },
      { name: 'Audio', icon: '🎵', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'] },
      { name: 'Text', icon: '📋', extensions: ['txt', 'md', 'json', 'xml', 'html', 'css', 'js'] },
      { name: 'Others', icon: '📁', extensions: [] },
    ];
  }
}