import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const uploadsDir = './public/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const clubUploadsDir = `${uploadsDir}/clubs_media`; // Ana klasör clubs_media olsun
if (!fs.existsSync(clubUploadsDir)) {
  fs.mkdirSync(clubUploadsDir, { recursive: true });
}

export const clubStorage = diskStorage({
  destination: (req, file, cb) => {
    let dest = `${clubUploadsDir}/temp`; // Varsayılan

    if (file.fieldname === 'logoFile' || file.fieldname === 'coverFile') {
      dest = `${clubUploadsDir}/images`;
    } else if (file.fieldname === 'clubFileBlobs') {
      dest = `${clubUploadsDir}/documents`;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const randomName = uuidv4();
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback(new Error('Sadece resim dosyalarına izin verilir!'), false);
  }
  callback(null, true);
};

export const documentFileFilter = (req, file, callback) => {
  // Şimdilik tüm dosya türlerine izin ver, isteğe bağlı olarak filtrelenebilir
  callback(null, true);
};
