const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  orientation: {
    type: String,
    required: true,
    enum: ["portrait", "landscape"],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
