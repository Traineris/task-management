import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { CustomError } from '../utils/customError';
import { StatusCodes } from 'http-status-codes';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Strict whitelist allowed extension to MIME types mapping
const ALLOWED_MIME_MAP: Record<string, string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.pdf': ['application/pdf'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.doc': ['application/msword'],
  '.txt': ['text/plain'],
  '.zip': ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'],
};

// Blacklist of dangerous extensions (RCE & Stored XSS defense-in-depth)
const DANGEROUS_EXTENSIONS = new Set([
  '.html', '.htm', '.svg', '.xml', '.xhtml',
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.bash', '.bin',
  '.php', '.php3', '.php4', '.php5', '.phtml', '.phar',
  '.js', '.mjs', '.ts', '.vbs', '.py', '.rb', '.pl', '.cgi',
  '.jsp', '.asp', '.aspx', '.htaccess', '.jar'
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Sanitasi: Buat nama file unik acak secara kriptografis untuk mencegah path traversal & name collision
    const randomName = crypto.randomBytes(16).toString('hex');
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `attachment-${Date.now()}-${randomName}${safeExt}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal 5 MB
    files: 1, // Single file upload
  },
  fileFilter: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();

    // 1. Tangkal ekstensi berbahaya (RCE / XSS)
    if (DANGEROUS_EXTENSIONS.has(rawExt)) {
      return cb(new CustomError('Tipe file berbahaya dilarang diunggah', StatusCodes.BAD_REQUEST) as any);
    }

    // 2. Validasi whitelist ekstensi
    const allowedMimes = ALLOWED_MIME_MAP[rawExt];
    if (!allowedMimes) {
      return cb(new CustomError('Format ekstensi file tidak didukung', StatusCodes.BAD_REQUEST) as any);
    }

    // 3. Validasi kesesuaian MIME Type (Cegah Content-Type Spoofing)
    if (!allowedMimes.includes(file.mimetype.toLowerCase())) {
      return cb(
        new CustomError('MIME type file tidak valid atau tidak cocok dengan ekstensinya', StatusCodes.BAD_REQUEST) as any
      );
    }

    return cb(null, true);
  },
});
