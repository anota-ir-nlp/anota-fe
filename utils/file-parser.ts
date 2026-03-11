import mammoth from 'mammoth';

export interface ParsedFileContent {
  title: string;
  text: string;
}

export async function parseFile(file: File): Promise<ParsedFileContent> {
  const title = file.name.replace(/\.(txt|doc|docx)$/i, '');

  if (file.name.toLowerCase().endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          reject(new Error("File tidak boleh kosong"));
          return;
        }
        resolve({ title, text: text.trim() });
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsText(file);
    });
  } else if (file.name.toLowerCase().endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      if (!text || text.trim().length === 0) {
        throw new Error("File tidak boleh kosong atau tidak dapat dibaca");
      }
      return { title, text: text.trim() };
    } catch (error) {
      throw new Error(`Gagal membaca file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    throw new Error("Format file tidak didukung. Gunakan .txt atau .docx");
  }
}

export function isValidFileType(fileName: string): boolean {
  return /\.(txt|docx)$/i.test(fileName);
}