import { parseOfficeAsync } from 'officeparser';
import * as pdfParse from 'pdf-parse';

export interface ParsedFileContent {
  title: string;
  text: string;
}

export async function parseFile(file: File): Promise<ParsedFileContent> {
  const title = file.name.replace(/\.(txt|doc|docx|pdf)$/i, '');

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
  } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const text = await parseOfficeAsync(buffer);
      if (!text || text.trim().length === 0) {
        throw new Error("File tidak boleh kosong atau tidak dapat dibaca");
      }
      return { title, text: text.trim() };
    } catch (error) {
      throw new Error(`Gagal membaca file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else if (file.name.toLowerCase().endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse(arrayBuffer);
      const text = data.text;
      if (!text || text.trim().length === 0) {
        throw new Error("File PDF tidak berisi teks atau tidak dapat dibaca");
      }
      return { title, text: text.trim() };
    } catch (error) {
      throw new Error(`Gagal membaca file PDF ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    throw new Error("Format file tidak didukung. Gunakan .txt, .doc, .docx, atau .pdf");
  }
}

export function isValidFileType(fileName: string): boolean {
  return /\.(txt|doc|docx|pdf)$/i.test(fileName);
}
