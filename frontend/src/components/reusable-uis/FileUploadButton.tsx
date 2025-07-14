import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "../icons/FileUploadIcon";

interface FileUploadButtonProps {
  onFileSelect: ({base64File,filename}: {base64File: string | null, filename: string}) => void;
  error?: boolean;
  errorTxt?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  error,
  errorTxt,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0] || null;
    //   console.log("file", file);
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onFileSelect({
            base64File: base64String,
            filename: file.name
          });
        };
        reader.readAsDataURL(file);
      } else {
        onFileSelect(file);
      }
    },
  });

  return (
    <div className="custom_file_upload">
      <div {...getRootProps()} className="file-upload-container">
        <input {...getInputProps()} id="proof" name="proof" />
        <button type="button" onClick={open} className="upload-button">
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <span className="placeholder">Upload jpeg, png, pdf</span>
          )}
          <FileUploadIcon className="file_upload_icon" />
        </button>
      </div>
      {error && errorTxt && <div className="error">{errorTxt}</div>}
    </div>
  );
};

export default FileUploadButton;
