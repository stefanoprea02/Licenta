import { InboxOutlined } from "@ant-design/icons";
import { Spin, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import styles from "./game-upload-form.module.scss";

interface GameUploadFormProps {
  gameId: string;
}

export default function GameUploadForm({ gameId }: GameUploadFormProps) {
  const [loading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleSucces = () => {
    setIsLoading(false);
    setUploaded(1);
  };

  // const handleError = (err: Response) => {
  //   setErrorMessage(err.data.message);
  //   setIsLoading(false);
  //   setUploaded(2);
  // };

  const handleTransform = async (file: File) => {
    const formData = new FormData();
    formData.append("game", file);

    console.log(progress);

    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;

    // Set up the progress event handler
    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        setProgress(percentage);
        console.log(`Upload progress: ${percentage.toFixed(2)}%`);
        return;
      }
    });

    // Set up the load event handler
    xhr.upload.addEventListener("load", function () {
      handleSucces();
      console.log("File uploaded successfully!");
    });

    // Set up the error event handler
    xhr.upload.addEventListener("error", function () {
      console.error("Error uploading file");
    });

    // Set up the abort event handler
    xhr.upload.addEventListener("abort", function () {
      console.warn("File upload aborted");
    });

    // Open the connection
    xhr.open(
      "POST",
      `http://localhost:3000/games/uploadGame?gameId=${gameId}`,
      true
    );

    // Send the FormData
    xhr.send(formData);

    setIsLoading(true);
  };

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    accept: ".zip",
    showUploadList: false,
    beforeUpload(file) {
      setUploaded(0);
      setIsLoading(true);
      handleTransform(file);
      return false;
    }
  };

  return (
    <div className={styles.formContainer}>
      {!loading ? (
        <Dragger {...props} className="dragger">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. File must be of type pdf.
          </p>
        </Dragger>
      ) : (
        <div className="spin-div">
          <Spin size="large" />
        </div>
      )}
      {uploaded === 1 && (
        <div className="message message-success">
          <p>File has been uploaded successfully</p>
        </div>
      )}
      {/* {uploaded === 2 && (
        <div className="message message-error">
          <p>There was an error when uploading the file</p>
          <p>{errorMessage}</p>
        </div>
      )} */}
    </div>
  );
}
