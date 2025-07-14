import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import { FileService } from './services/FileService';
import { StorageService } from './services/StorageService';
import { FolderService } from './services/FolderService';

class FileOrganizerApp {
  private mainWindow: BrowserWindow | null = null;
  private fileService: FileService;
  private storageService: StorageService;
  private folderService: FolderService;

  constructor() {
    this.fileService = new FileService();
    this.storageService = new StorageService();
    this.folderService = new FolderService();
  }

  public async createWindow(): Promise<void> {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      titleBarStyle: 'default',
      show: false,
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      await this.mainWindow.loadURL('http://localhost:8080');
      this.mainWindow.webContents.openDevTools();
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  public setupIpcHandlers(): void {
    // Folder selection
    ipcMain.handle('select-folder', async (): Promise<string | null> => {
      if (!this.mainWindow) return null;
      
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory'],
        title: 'Select Storage Folder',
        buttonLabel: 'Select Folder'
      });

      return result.canceled ? null : result.filePaths[0];
    });

    // Create folders
    ipcMain.handle('create-folders', async (_, basePath: string, folders: string[]): Promise<boolean> => {
      try {
        return await this.folderService.createFolders(basePath, folders);
      } catch (error) {
        console.error('Error creating folders:', error);
        return false;
      }
    });

    // Move file
    ipcMain.handle('move-file', async (_, sourcePath: string, targetPath: string): Promise<boolean> => {
      try {
        return await this.fileService.moveFile(sourcePath, targetPath);
      } catch (error) {
        console.error('Error moving file:', error);
        return false;
      }
    });

    // Check if file exists
    ipcMain.handle('file-exists', async (_, filePath: string): Promise<boolean> => {
      try {
        return await this.fileService.fileExists(filePath);
      } catch (error) {
        console.error('Error checking if file exists:', error);
        return false;
      }
    });

    // Storage config
    ipcMain.handle('get-storage-config', async () => {
      return await this.storageService.getConfig();
    });

    ipcMain.handle('save-storage-config', async (_, config) => {
      return await this.storageService.saveConfig(config);
    });

    // Show toast notification
    ipcMain.handle('show-toast', (_, message: string, type: string) => {
      // Could integrate with system notifications here
      console.log(`Toast [${type}]: ${message}`);
    });
  }

  public async initialize(): Promise<void> {
    await app.whenReady();
    this.setupIpcHandlers();
    await this.createWindow();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await this.createWindow();
      }
    });
  }
}

// Initialize the app
const fileOrganizerApp = new FileOrganizerApp();
fileOrganizerApp.initialize().catch(console.error);
