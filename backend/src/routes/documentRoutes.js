const express = require('express');
const documents = express.Router();
const { uploadDocuments, getDocuments } = require('../controllers/documentController');
const upload = require('../middleware/multer');

documents.post('/upload', upload.array('documents', 10), uploadDocuments);
documents.get('/list', getDocuments);

module.exports = documents