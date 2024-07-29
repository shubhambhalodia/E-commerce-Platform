import React, { useState, useEffect } from "react";
import "./ImageBanner.css";
import image1 from "../../images/image1.webp";
import image2 from "../../images/image2.webp";
import image3 from "../../images/image3.webp";
import image4 from "../../images/image4.webp";
import image5 from "../../images/image5.webp";
import image6 from "../../images/image6.webp";

const ImageBanner = () => {
  const images = [image1, image2, image3, image4, image5, image6,image1, image2, image3, image4, image5, image6,image1, image2, image3, image4, image5, image6,image1, image2, image3, image4, image5, image6,image1, image2, image3, image4, image5, image6,image1, image2, image3, image4, image5, image6];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="image-banner">
      <div className="image-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`banner-img-${index}`} className="banner-image" />
        ))}
      </div>
    </div>
  );
};

export default ImageBanner;
