import React, { useState, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import axios from "axios";

const MultipleDocumentUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedView, setSelectedView] = useState("grid");
  const [images, setImages] = useState([]);

  console.log(images);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:2000/images/list");
        const backendImages = response.data.map((img) => ({
          id: img._id,
          url: img.image.secure_url,
          orientation: img.orientation,
        }));
        setUploadedImages(backendImages);
        setImages(backendImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);


  // Toggle image orientation manually
  const toggleOrientation = (id) => {
    setUploadedImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id
          ? {
              ...image,
              orientation:
                image.orientation === "landscape" ? "portrait" : "landscape",
            }
          : image
      )
    );
  };


  const getPositionedImagesForGrid = () => {
    const images = [...uploadedImages];
    const isPortraitFirst = images[0]?.orientation === "portrait";

    const landscapeRule = [0, 3, 6]; 
    const portraitRule = [1, 2, 4, 5]; 

    const portraitRulePortraitFirst = [0, 2, 4, 6];
    const landscapeRulePortraitFirst = [3, 5, 8];

    const grid = new Array(9).fill(null);
    let landscapeCount = 0;
    let portraitCount = 0;

    images.forEach((img) => {
      if (img.orientation === "portrait") {
        const pos = isPortraitFirst
          ? portraitRulePortraitFirst[portraitCount]
          : portraitRule[portraitCount];
        if (pos !== undefined) grid[pos] = img;
        portraitCount++;
      } else {
        const pos = isPortraitFirst
          ? landscapeRulePortraitFirst[landscapeCount]
          : landscapeRule[landscapeCount];
        if (pos !== undefined) grid[pos] = img;
        landscapeCount++;
      }
    });

    return grid;
  };

  const getPositionedImagesForLinear = () => {
    return uploadedImages.filter((img) => img.orientation);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <h1 className="text-2xl font-bold mb-2">Grid View</h1>
      {uploadedImages.length > 0 && (
        <div className="mb-4 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedView === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedView("grid")}
          >
            Grid View
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedView === "linear"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedView("linear")}
          >
            Linear View
          </button>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">
            Image Preview ({uploadedImages.length})
          </h2>

          {selectedView === "grid" ? (
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl mx-auto">
              {getPositionedImagesForGrid().map((image, index) => {
                if (!image) return null; // Don't render empty slots

                const isLandscape = image.orientation === "landscape";
                const colSpan = isLandscape ? "col-span-2" : "col-span-1";

                return (
                  <div
                    key={image.id}
                    className={`${colSpan} relative rounded-lg overflow-hidden border border-gray-300 ${
                      isLandscape ? "aspect-[16/9]" : "aspect-[9/16]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white p-1 rounded-lg text-xs px-2"
                        onClick={() => toggleOrientation(image.id)}
                      >
                        Toggle {isLandscape ? "to Portrait" : "to Landscape"}
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-sm">
                      Position {index + 1} ({image.orientation})
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {getPositionedImagesForLinear().map((image, index) => (
                <div
                  key={image.id}
                  className="relative rounded-lg overflow-hidden border border-gray-300"
                >
                  <img
                    src={image.url}
                    alt={`Upload ${index}`}
                    className={`w-full ${
                      image.orientation === "landscape" ? "h-10" : "h-20"
                    } object-cover`}
                  />
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white p-1 rounded-lg text-xs px-2"
                      onClick={() => toggleOrientation(image.id)}
                    >
                      Toggle{" "}
                      {image.orientation === "landscape"
                        ? "to Portrait"
                        : "to Landscape"}
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1">
                    {image.orientation} - Position {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleDocumentUpload;
