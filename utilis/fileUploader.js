const multer = require("multer");
const path = require("path");

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "model/gltf-binary") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only images and .glb files are allowed!"), false);
    }
  },
});

// Middleware to return file URL using Render backend
const getUploadedFilePath = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Render backend URL
  const backendUrl = "https://backend-zd8i.onrender.com";
  const fileUrl = `${backendUrl}/uploads/${req.file.filename}`;

  res.json({ fileUrl });
};

module.exports = { upload, getUploadedFilePath };
