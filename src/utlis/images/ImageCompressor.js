// https://dev.to/wchr/compress-images-in-react-browser-image-compression-libary-3cja
import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";
import prettyBytes from "pretty-bytes";


export const compressImg = (file, callback, props={maxWidth:300, maxHeight:300}) => {
    if (file) {
        new Compressor(file, {
          quality: 0.9,
           ...props,
          //convertSize: 1000000, // 1MB
          success(blob) {
            callback({
              url: URL.createObjectURL(blob),
              size: blob.size,
              type: blob.type,
            });
          },
        });
      }
    
}

function ImageCompressor({ file }) {
  const [newImage, setNewImage] = useState();

  const handleImage = (image) => {
    setNewImage(image);
  };

  useEffect(() => {
    compressImg(file, handleImage)
    }
  , [file]);

  if (!newImage) {
    return null;
  }

  return (
    <>
      <figure>{`${prettyBytes(newImage.size)} ${newImage.type}`}</figure>
      <img src={newImage.url} alt="" style={{ maxWidth: "100%" }} />
    </>
  );
}

export default ImageCompressor;
