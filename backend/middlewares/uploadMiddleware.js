import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the directory exists
const uploadDir = "/var/www/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  // console.log("✅ Created upload directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif|heic/i; // Add 'heic' to the allowed types
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error('File type not allowed')); // Reject the file
    }
  }
});


export default upload;
