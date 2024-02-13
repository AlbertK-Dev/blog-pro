// https://dev.to/wchr/compress-images-in-react-browser-image-compression-libary-3cja
import React, { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import prettyBytes from "pretty-bytes";


/*import Resizer from "react-image-file-resizer";

Resizer.imageFileResizer(
  file, // Is the file of the image which will resized.
  maxWidth, // Is the maxWidth of the resized new image.
  maxHeight, // Is the maxHeight of the resized new image.
  compressFormat, // Is the compressFormat of the resized new image.
  quality, // Is the quality of the resized new image.
  rotation, // Is the degree of clockwise rotation to apply to uploaded image.
  responseUriFunc, // Is the callBack function of the resized new image URI.
  outputType, // Is the output type of the resized new image. 
  minWidth, // Is the minWidth of the resized new image.
  minHeight // Is the minHeight of the resized new image.
);*/

/*import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => { //or blob
        resolve(uri);
      },
      "base64" //or blob
    );
  });*/


export const resizeImage = (file, callbackFn, properties={}) => {

}

function ImageResizer({ title, description, file }) {
  const [newImage, setNewImage] = useState();

  const handleImage = (image) => {
    setNewImage(image);
  };

  useEffect(() => {
    if (file) {
      console.log("File received", file);
      try {
        Resizer.imageFileResizer(
          file,
          200,
          200,
          "JPEG",
          90,
          0,
          (blob) => {
              handleImage({
                  blob,
                  url: URL.createObjectURL(blob),
              size: blob.size,
              type: blob.type,
            });
          },
          "blob",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [file]);

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

export default ImageResizer;
