"use client";
import { CheckCircle, Upload, AlertCircle, X } from "lucide-react";
import { useState, useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

const FileUploader = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Please upload only PDF files.");
        } else if (rejection.errors[0]?.code === "file-too-large") {
          setError("File size must be less than 10MB.");
        } else {
          setError("Invalid file. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    [setSelectedFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
      multiple: false,
    });

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="form-div mt-3">
      <div
        {...getRootProps()}
        className={`upload-area cursor-pointer transition-all duration-200 relative min-h-[200px] flex items-center justify-center ${
          isDragActive && !isDragReject
            ? "border-[#AB8C95] bg-gray-50 border-solid"
            : ""
        } ${isDragReject ? "border-red-400 bg-red-50 border-solid" : ""} ${
          selectedFile ? "border-green-400 bg-green-50" : ""
        }`}
      >
        <input {...getInputProps()} />

        {/* Remove button positioned at top-right corner */}
        {selectedFile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="absolute top-3 right-3 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors z-10"
          >
            <X className="h-4 w-4 text-red-600" />
          </button>
        )}

        <div className="flex flex-col items-center gap-4 py-6 px-4">
          {selectedFile ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 flex-shrink-0" />
              <div className="text-center">
                <p className="font-medium text-green-700 break-words">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB - Ready for
                  analysis
                </p>
              </div>
            </>
          ) : (
            <>
              {isDragReject ? (
                <AlertCircle className="h-12 w-12 text-red-400 flex-shrink-0" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400 flex-shrink-0" />
              )}
              <div className="text-center">
                {isDragActive ? (
                  isDragReject ? (
                    <p className="font-medium text-red-600">
                      Invalid file type
                    </p>
                  ) : (
                    <p className="font-medium text-[#AB8C95]">
                      Drop your resume here
                    </p>
                  )
                ) : (
                  <>
                    <p className="font-medium text-gray-700">
                      Drag and drop your resume here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse files
                    </p>
                  </>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Supports PDF Only (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
