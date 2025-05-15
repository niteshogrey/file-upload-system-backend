const express = require('express');
const documents = express.Router();
const multer = require('multer');
const { uploadDocuments, getDocuments } = require('../controllers/documentController');
const upload = require('../middleware/multer');

const documentUpload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

documents.post('/upload', upload.array('documents', 10), uploadDocuments);
documents.get('/list', getDocuments);

module.exports = documents