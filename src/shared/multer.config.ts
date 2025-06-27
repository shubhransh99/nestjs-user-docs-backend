// src/shared/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerDocumentOptions = {
  storage: diskStorage({
    destination: './uploads/documents',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Optional MIME filter
    if (!file.mimetype) return cb(null, false);
    cb(null, true);
  },
};
