import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsRoot = path.resolve(__dirname, '../../uploads');
export const pdfUploadDir = path.join(uploadsRoot, 'pdfs');

const PDF_PUBLIC_PREFIX = 'local/pdfs/';
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function ensurePdfDir() {
  fs.mkdirSync(pdfUploadDir, { recursive: true });
}

function isPdfUpload(file) {
  const name = file.originalname?.toLowerCase() || '';
  return file.mimetype === 'application/pdf' || name.endsWith('.pdf');
}

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    ensurePdfDir();
    callback(null, pdfUploadDir);
  },
  filename(_req, file, callback) {
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 80) || 'document';
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    callback(null, `${base}-${unique}.pdf`);
  },
});

export const pdfUpload = multer({
  storage,
  limits: { fileSize: MAX_PDF_BYTES, files: 1 },
  fileFilter(_req, file, callback) {
    if (!isPdfUpload(file)) {
      const error = new Error('Only PDF files can be stored locally');
      error.statusCode = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

export function assertPdfMagicBytes(filePath) {
  const header = Buffer.alloc(5);
  const fd = fs.openSync(filePath, 'r');
  try {
    const bytesRead = fs.readSync(fd, header, 0, 5, 0);
    if (bytesRead < 5 || header.toString('utf8') !== '%PDF-') {
      const error = new Error('Only PDF files can be stored locally');
      error.statusCode = 400;
      throw error;
    }
  } finally {
    fs.closeSync(fd);
  }
}

export function mapLocalPdfUpload(file) {
  return {
    type: 'image',
    provider: 'local',
    publicId: `${PDF_PUBLIC_PREFIX}${file.filename}`,
    secureUrl: `/uploads/pdfs/${file.filename}`,
    thumbnailUrl: '',
    format: 'pdf',
    width: 0,
    height: 0,
    duration: 0,
    bytes: file.size,
    originalFilename: file.originalname,
  };
}

function resolveLocalPdfPath(publicId) {
  if (!publicId || !String(publicId).startsWith(PDF_PUBLIC_PREFIX)) return null;

  const filename = path.basename(String(publicId));
  if (!filename.toLowerCase().endsWith('.pdf')) return null;

  const filePath = path.resolve(pdfUploadDir, filename);
  const relative = path.relative(pdfUploadDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;

  return filePath;
}

export function deleteLocalFile(publicId) {
  const filePath = resolveLocalPdfPath(publicId);
  if (!filePath) return { result: 'not_found' };

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return { result: 'ok' };
  }

  return { result: 'not_found' };
}

export function removeUploadedFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
