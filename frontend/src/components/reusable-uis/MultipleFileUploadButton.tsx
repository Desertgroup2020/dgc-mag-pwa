import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "../icons/FileUploadIcon";
import Image from "next/image";
import { CircleX } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelect: (
    files: { base64File: string | null; file_name: string }[]
  ) => void;
  handleFileRemove: (
    files: { base64File: string | null; file_name: string }[]
  ) => void;
  error?: boolean;
  errorTxt?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  handleFileRemove,
  error,
  errorTxt,
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [previews, setPreviews] = useState<
    { base64File: string | null; file_name: string }[]
  >([]);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles) => {
      const filePromises = acceptedFiles.map((file) => {
        return new Promise<{ base64File: string | null; file_name: string }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              resolve({ base64File: base64String, file_name: file.name });
            };
            reader.readAsDataURL(file);
          }
        );
      });

      Promise.all(filePromises).then((files) => {
        setFileNames(files.map((file) => file.file_name));
        setPreviews((prev) => [...prev, ...files]);
        onFileSelect(files);
      });
    },
  });

  const handleRemoveImage = (filename: string) => {
    const updatedPreviews = previews.filter(
      (file) => file.file_name !== filename
    );
    setPreviews(updatedPreviews);
    setFileNames(updatedPreviews.map((file) => file.file_name));
    handleFileRemove(updatedPreviews);
  };

  return (
    <div className="custom_file_upload">
      <div className="preview-container">
        {previews.map((preview, index) => (
          <div className="preview_item" key={index}>
            <Image
              width={60}
              height={60}
              src={preview.base64File || ""}
              alt={`Preview ${index + 1}`}
              className="preview-image"
            />
            <button
              type="button"
              className="close-button"
              onClick={() => handleRemoveImage(preview.file_name)}
            >
              <CircleX />
            </button>
          </div>
        ))}
      </div>
      <div {...getRootProps()} className="file-upload-container">
        <input {...getInputProps()} id="proof" name="proof" multiple />
        <button type="button" onClick={open} className="upload-button">
          <span className="placeholder">Upload jpeg, png</span>
          <FileUploadIcon className="file_upload_icon" />
        </button>
      </div>
      {error && errorTxt && <div className="error">{errorTxt}</div>}
    </div>
  );
};

export default FileUploadButton;
