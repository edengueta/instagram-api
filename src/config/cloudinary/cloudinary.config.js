const cloudinary = require('cloudinary');
try {
  const api_secret = require("./api_secret");
} catch(e) {
  console.log(e)
}

cloudinary.config({ 
    cloud_name: 'edengueta', 
    api_key: '252315661325637', 
    api_secret: process.env.CLOUDINARY_API_SECRET || api_secret
  });
  
  module.exports = cloudinary;