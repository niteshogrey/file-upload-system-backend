const cloudinary = require("cloudinary").v2;
require("dotenv").config();


const connectCloudinary = () => {
    const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        console.error("⚠️  Cloudinary environment variables are missing!");
        process.exit(1); 
    }

    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET,
        timeout: 60000,
    });

    console.log("Cloudinary connected successfully!");
};

module.exports = connectCloudinary;
