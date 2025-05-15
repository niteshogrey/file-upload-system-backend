const Document = require("../model/documentModel");

const uploadDocuments = async (req, res) => {
    try {
        const files = req.files;
        const documents = files.map(file => ({
            filename: file.filename,  
            originalName: file.originalname,
            size: file.size
        }));
        await Document.insertMany(documents);
        res.status(201).json({ message: "Documents uploaded successfully!", documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading documents." });
    }
};

module.exports = { uploadDocuments };


const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ uploadedAt: 1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching documents.' });
    }
};

module.exports = {uploadDocuments, getDocuments}