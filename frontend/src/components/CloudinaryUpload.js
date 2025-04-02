import React, { useCallback } from 'react';

const CloudinaryUpload = ({ onImageUpload, currentImageUrl }) => {
  // Initialize Cloudinary widget
  const cloudinaryWidget = useCallback(() => {

    return window.cloudinary.createUploadWidget(
      {
        cloudName: "dl3dsnroa",         // cloud name
        uploadPreset: "TastyCartAdmin", // Upload preset
        sources: ["local", "url", "camera"], //allowed sources for upload widget
        multiple: false                 //can upload only one file at a time
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success! Image URL:", result.info.secure_url);
          // Call the callback function with the uploaded image URL
          onImageUpload(result.info.secure_url);
        }
      }
    );
  }, [onImageUpload]);

  // Function to open the widget
  const openUploadWidget = () => {
    const widget = cloudinaryWidget();
    widget.open();
  };

  return (
    <div className="mb-3">
      <label className="form-label">Product Image</label>
      <div className="d-flex align-items-center gap-2">
        <input
          type="text"
          className="form-control"
          name="image"
          value={currentImageUrl || ''}
          onChange={(e) => onImageUpload(e.target.value)}
          placeholder="Image URL"
          readOnly={false}
        />
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={openUploadWidget}
        >
          Upload Image
        </button>
      </div>
      {currentImageUrl && (
        <div className="mt-2">
          <img 
            src={currentImageUrl} 
            alt="Product preview" 
            className="img-thumbnail"
            style={{ maxHeight: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;