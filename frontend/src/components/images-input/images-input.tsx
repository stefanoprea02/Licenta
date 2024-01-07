import styles from "./images-input.module.scss";

interface ImagesInputProps {
  imageFiles: File[];
  imageStrings: string[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImageString: (id: string) => void;
  handleRemoveImageFile: (name: string) => void;
  validationMessage?: string;
}

export default function ImagesInput({
  imageFiles,
  imageStrings,
  handleInputChange,
  validationMessage,
  handleRemoveImageString,
  handleRemoveImageFile
}: ImagesInputProps) {
  const images = [];
  if (!imageFiles && !imageStrings) return [];
  images.push(
    imageStrings.map((imageString) => (
      <img
        className={styles.image}
        key={imageString}
        src={`http://localhost:3000/${imageString}`}
        onClick={() => handleRemoveImageString(imageString)}
      />
    ))
  );
  images.push(
    imageFiles.map((imageFile) => (
      <img
        className={styles.image}
        key={URL.createObjectURL(imageFile)}
        src={URL.createObjectURL(imageFile)}
        onClick={() => handleRemoveImageFile(imageFile.name)}
      />
    ))
  );

  return (
    <>
      <div className={styles.imagesContainer}>
        {images}
        {images.length < 8 && (
          <input
            type="file"
            name="images"
            className={styles.imageInput}
            onChange={handleInputChange}
            accept="image/png, image/jpeg"
          />
        )}
        {validationMessage && (
          <p className={styles.errorMessage}>{validationMessage}</p>
        )}
      </div>
    </>
  );
}
