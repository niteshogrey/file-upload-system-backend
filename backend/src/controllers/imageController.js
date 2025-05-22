const Image = require("../model/imageModel");
const cloudinary = require("cloudinary").v2;

const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    const { orientation } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const orientations = Array.isArray(orientation)
      ? orientation
      : new Array(files.length).fill(orientation);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const currentOrientation = orientations[i];

      if (!["portrait", "landscape"].includes(currentOrientation)) {
        return res
          .status(400)
          .json({ message: `Invalid orientation for image ${file.originalname}` });
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "file-upload-system",
      });

      const image = new Image({
        fileName: file.originalname,
        image: {
          url: result.url,
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
        orientation: currentOrientation,
      });

      await image.save();
      uploadedImages.push(image);

      // Clean up the local file after upload
      fs.unlinkSync(file.path);
    }

    res
      .status(201)
      .json({ message: "Images uploaded successfully!", images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image(s)." });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching images." });
  }
};

module.exports = { uploadImage, getImages };
