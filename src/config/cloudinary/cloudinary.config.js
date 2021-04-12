// const api_secret = require("./api_secret") || "";
const cloudinary = require('cloudinary');


cloudinary.config({ 
    cloud_name: 'edengueta', 
    api_key: '252315661325637', 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  module.exports = cloudinary;