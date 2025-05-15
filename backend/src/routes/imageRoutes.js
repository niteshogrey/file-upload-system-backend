const express = require('express');
const image = express.Router();
const { getImages, uploadImage } = require('../controllers/imageController');
const upload = require('../middleware/multer');



image.post('/upload', upload.single('image'), uploadImage);
image.get('/list', getImages);

module.exports = image;