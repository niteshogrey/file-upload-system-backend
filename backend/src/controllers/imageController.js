const Image = require("../model/imageModel");

const uploadImage = async (req, res) => {
    try {
        const { orientation } = req.body;
        
        if (!["portrait", "landscape"].includes(orientation)) {
            return res.status(400).json({ message: "Invalid orientation." });
        }
        const file = req.file;
        console.log(file);
        
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const image = new Image({
            fileName: file.filename, 
            orientation
        });
        await image.save();

        res.status(201).json({ message: "Image uploaded successfully!", image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading image." });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await Image.find().sort({ uploadedAt: 1 });
        res.status(200).json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching images.' });
    }
};

module.exports = { uploadImage, getImages}