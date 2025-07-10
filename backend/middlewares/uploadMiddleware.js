const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // cb(error, destination)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // cb(error, filename)
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file - cb(error, boolean)
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false); // Reject the file - cb(error, boolean)
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

