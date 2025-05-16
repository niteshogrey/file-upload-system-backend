const Document = require("../model/documentModel");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const uploadDocuments = async (req, res) => {
  try {
    const files = req.files;

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "file-upload-system",
          });

          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });

          return {
            public_id: result.public_id,
            url: result.secure_url,
            secure_url: result.secure_url,
          };
        } catch (error) {
          console.error("Cloudinary upload failed:", error.message);
          return null;
        }
      })
    );

    const documents = files.map((file, index) => {
      const uploadResult = uploadResults[index];
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        files: uploadResult ? [uploadResult] : [],
      };
    });

    // Save to MongoDB
    const savedDocuments = await Document.insertMany(documents);

    res
      .status(201)
      .json({
        message: "Documents uploaded successfully!",
        documents: savedDocuments,
      });
  } catch (error) {
    console.error("Error uploading documents:", error);
    res.status(500).json({ message: "Error uploading documents." });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: 1 });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching documents." });
  }
};

module.exports = { uploadDocuments, getDocuments };
