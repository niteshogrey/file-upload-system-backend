const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document