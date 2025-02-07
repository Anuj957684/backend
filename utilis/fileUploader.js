const multer = require("multer");
const path = require("path");

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Set the file name with the original name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 30 MB
  fileFilter: (req, file, cb) => {
   

   if (
  file.mimetype === "model/gltf-binary" ||
  file.mimetype === "model/vnd.usdz+zip" || // Add USDZ MIME type
  path.extname(file.originalname).toLowerCase() === ".glb" ||
  path.extname(file.originalname).toLowerCase() === ".usdz" // Add USDZ extension check
) {
  cb(null, true); // Accept the file
} else {
  cb(new Error("Invalid file type, only .glb and .usdz files are allowed!"), false); // Reject other files
}

  },
});

module.exports = upload;