import multer from 'multer';
import fs from 'fs';

const TMP_DIR = '/tmp/presentations';
fs.mkdirSync(TMP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: TMP_DIR,
  filename: (_, __, cb) => {
    cb(null, 'temporary_name.pptx');
  },
});

export const multerMiddleware = multer({ storage }).single('file');
