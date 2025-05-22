import { useState } from "react";
import axios from "axios";
import MultipleDocumentUpload from "./MultipleDocumentUpload";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageData = files.map((file) => ({
      file,
      name: file.name,
      orientation: "portrait", // default
      url: URL.createObjectURL(file),
    }));
    setImages(imageData);
  };

  const handleOrientationChange = (index, value) => {
    const newImages = [...images];
    newImages[index].orientation = value;
    setImages(newImages);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("images", img.file);
      formData.append("orientation", img.orientation);
    });

    try {
      await axios.post("http://localhost:2000/images/upload", formData);
      alert("Images uploaded successfully");
      setUploadedImages(images);
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-1">
      <h2>Upload Images with Orientation</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="border py-1 w-23 px-1 bg-gray-300 mr-2 cursor-pointer"
      />
      {images.map((img, index) => (
        <div key={index} className="flex">
          <img
            src={img.url}
            alt={img.name}
            style={{ width: "100px", marginRight: "10px", display: "flex" }}
          />
          <select
            value={img.orientation}
            onChange={(e) => handleOrientationChange(index, e.target.value)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      ))}
      <button onClick={handleUpload} className="bg-blue-500 px-2 py-1">
        Upload
      </button>
      <hr />
      <MultipleDocumentUpload />
    </div>
  );
};

export default ImageUploader;
