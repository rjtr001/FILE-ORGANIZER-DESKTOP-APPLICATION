import * as fs from 'fs/promises';
import * as path from 'path';

export class FolderService {
  public async createFolders(basePath: string, folderNames: string[]): Promise<boolean> {
    try {
      // Create base directory if it doesn't exist
      await fs.mkdir(basePath, { recursive: true });

      // Create each subfolder
      for (const folderName of folderNames) {
        const folderPath = path.join(basePath, folderName);
        await fs.mkdir(folderPath, { recursive: true });
      }

      return true;
    } catch (error) {
      console.error('Error creating folders:', error);
      return false;
    }
  }

  public async folderExists(folderPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(folderPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}