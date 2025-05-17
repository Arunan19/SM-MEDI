const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    secure: true 
  }); // It reads from CLOUDINARY_URL automatically
  

module.exports = cloudinary;