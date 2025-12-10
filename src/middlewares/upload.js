// multerConfig.js (Modified for Scenario 1)

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueName = `${Date.now()}-${safeOriginalName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File upload rejected: Only image files are allowed.'), false); 
    }
  }
});

// REMOVED: const venueUploadMiddleware = upload.fields([...]); 
// This specific middleware is now defined in the router file.

// EXPORT THE CONFIGUED MULTER INSTANCE
module.exports = upload;