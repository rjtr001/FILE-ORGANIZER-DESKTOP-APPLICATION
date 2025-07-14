export interface FileItem {
    id: string;
    name: string;
    path: string;
    size: number;
    type: string;
    extension: string;
    targetFolder: string;
    status: 'pending' | 'processing' | 'success' | 'error';
    error?: string;
  }
  
  export interface FolderConfig {
    name: string;
    icon: string;
    extensions: string[];
    path?: string;
  }
  
  export interface StorageConfig {
    basePath: string;
    folders: FolderConfig[];
    isConfigured: boolean;
  }
  
  export interface ProcessingStats {
    total: number;
    processed: number;
    success: number;
    errors: number;
    progress: number;
  }
  
  export interface ElectronAPI {
    selectFolder: () => Promise<string | null>;
    createFolders: (basePath: string, folders: string[]) => Promise<boolean>;
    moveFile: (sourcePath: string, targetPath: string) => Promise<boolean>;
    getStorageConfig: () => Promise<StorageConfig | null>;
    saveStorageConfig: (config: StorageConfig) => Promise<boolean>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    fileExists: (filePath: string) => Promise<boolean>;
  }
  
  declare global {
    interface Window {
      electronAPI: ElectronAPI;
    }
  }