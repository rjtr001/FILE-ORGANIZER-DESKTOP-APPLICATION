import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI } from '../types';

// Expose global object to renderer
window.global = window;

const electronAPI: ElectronAPI = {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  createFolders: (basePath: string, folders: string[]) => 
    ipcRenderer.invoke('create-folders', basePath, folders),
  moveFile: (sourcePath: string, targetPath: string) => 
    ipcRenderer.invoke('move-file', sourcePath, targetPath),
  getStorageConfig: () => ipcRenderer.invoke('get-storage-config'),
  saveStorageConfig: (config) => ipcRenderer.invoke('save-storage-config', config),
  showToast: (message: string, type: 'success' | 'error' | 'info') => 
    ipcRenderer.invoke('show-toast', message, type),
  fileExists: (filePath: string) => ipcRenderer.invoke('file-exists', filePath),
};

// Expose both the electronAPI and global object
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('global', window);
