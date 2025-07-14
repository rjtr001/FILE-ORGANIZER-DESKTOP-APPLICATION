import * as fs from 'fs/promises';
import * as path from 'path';

export class FileService {
  public async moveFile(sourcePath: string, targetPath: string): Promise<boolean> {
    try {
      // Check if source file exists before moving
      const sourceExists = await this.fileExists(sourcePath);
      if (!sourceExists) {
        console.error(`Source file does not exist: ${sourcePath}`);
        return false;
      }

      // Ensure target directory exists
      const targetDir = path.dirname(targetPath);
      await fs.mkdir(targetDir, { recursive: true });

      // Handle file name conflicts
      let finalTargetPath = targetPath;
      let counter = 1;
      
      while (await this.fileExists(finalTargetPath)) {
        const ext = path.extname(targetPath);
        const name = path.basename(targetPath, ext);
        const dir = path.dirname(targetPath);
        finalTargetPath = path.join(dir, `${name}_${counter}${ext}`);
        counter++;
      }

      try {
        // Try direct rename first (for same-device moves)
        await fs.rename(sourcePath, finalTargetPath);
      } catch (error: any) {
        // If rename fails with EXDEV (cross-device), use copy + delete
        if (error.code === 'EXDEV') {
          await fs.copyFile(sourcePath, finalTargetPath);
          await fs.unlink(sourcePath);
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error moving file:', error);
      return false;
    }
  }

  public async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase().slice(1);
  }

  public async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }
}