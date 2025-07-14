import { useState, useCallback } from 'react';
import { FileItem, ProcessingStats } from '../../types';

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    processed: 0,
    success: 0,
    errors: 0,
    progress: 0,
  });

  const addFiles = useCallback((newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      path: (file as any).path || file.name, // Fixed: Handle path property for Electron
      size: file.size,
      type: file.type,
      extension: getFileExtension(file.name),
      targetFolder: determineTargetFolder(file.name),
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...fileItems]);
    setStats(prev => ({
      ...prev,
      total: prev.total + fileItems.length,
    }));
  }, []);

  const processFiles = useCallback(async (basePath: string) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      if (file.status !== 'pending') continue;

      // Update file status to processing
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      try {
        // Validate source file path existence before moving
        const sourceExists = await window.electronAPI.fileExists(file.path);
        if (!sourceExists) {
          throw new Error(`Source file does not exist: ${file.path}`);
        }

        const targetPath = `${basePath}/${file.targetFolder}/${file.name}`;
        const success = await window.electronAPI.moveFile(file.path, targetPath);

        if (success) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'success' } : f
          ));
          successCount++;
        } else {
          throw new Error('Failed to move file');
        }
      } catch (error) {
        // Fixed: Proper error handling with type assertion
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error', error: errorMessage } : f
        ));
        errorCount++;
      }

      processedCount++;
      setStats(prev => ({
        ...prev,
        processed: processedCount,
        success: successCount,
        errors: errorCount,
        progress: (processedCount / files.length) * 100,
      }));
    }

    setIsProcessing(false);
  }, [files]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setStats({
      total: 0,
      processed: 0,
      success: 0,
      errors: 0,
      progress: 0,
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
    }));
  }, []);

  return {
    files,
    stats,
    isProcessing,
    addFiles,
    processFiles,
    clearFiles,
    removeFile,
  };
};

const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

const determineTargetFolder = (fileName: string): string => {
  const extension = getFileExtension(fileName);
  
  const folderMap: Record<string, string> = {
    // Videos
    mp4: 'Videos', avi: 'Videos', mkv: 'Videos', mov: 'Videos', 
    wmv: 'Videos', flv: 'Videos', webm: 'Videos',
    
    // Images
    jpg: 'Images', jpeg: 'Images', png: 'Images', gif: 'Images',
    bmp: 'Images', svg: 'Images', webp: 'Images',
    
    // PDFs
    pdf: 'PDFs',
    
    // Excel
    xlsx: 'Excel', xls: 'Excel', xlsm: 'Excel', csv: 'Excel',
    
    // Word
    docx: 'Word', doc: 'Word', rtf: 'Word',
    
    // PowerPoint
    pptx: 'PowerPoint', ppt: 'PowerPoint',
    
    // ZIP
    zip: 'ZIP', rar: 'ZIP', '7z': 'ZIP', tar: 'ZIP', gz: 'ZIP',
    
    // Audio
    mp3: 'Audio', wav: 'Audio', flac: 'Audio', aac: 'Audio',
    ogg: 'Audio', wma: 'Audio',
    
    // Text
    txt: 'Text', md: 'Text', json: 'Text', xml: 'Text',
    html: 'Text', css: 'Text', js: 'Text',
  };

  return folderMap[extension] || 'Others';
};