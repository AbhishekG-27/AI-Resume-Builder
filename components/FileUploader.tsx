"use client";
import { CheckCircle, Upload, AlertCircle, X, FileText } from "lucide-react";
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
    <div className="form-div">
      <div
        {...getRootProps()}
        className={`w-full p-6 sm:p-8 inset-shadow rounded-2xl bg-white border-2 border-dashed transition-all duration-200 cursor-pointer relative min-h-[220px] sm:min-h-[240px] flex items-center justify-center group ${
          isDragActive && !isDragReject
            ? "border-blue-500 bg-gradient-to-br from-blue-50/80 via-transparent to-blue-100/60 shadow-lg"
            : selectedFile
            ? "border-green-500 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-lg"
            : isDragReject
            ? "border-red-400 bg-gradient-to-br from-red-50 via-white to-red-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/30 hover:via-white hover:to-blue-50/30"
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
            className="absolute top-4 right-4 p-2 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm z-10 group-hover:shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col items-center gap-6 py-4 px-4 text-center max-w-md">
          {selectedFile ? (
            <>
              <div className="relative">
                <div className="p-4 bg-green-100 rounded-full border-4 border-green-200">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                </div>
                <CheckCircle className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-green-700 text-sm sm:text-base break-words px-2">
                  {selectedFile.name}
                </p>
                <div className="px-3 py-1 bg-green-100 rounded-full">
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-all duration-200 ${
                isDragReject
                  ? "bg-red-100 border-4 border-red-200"
                  : isDragActive
                  ? "bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300"
                  : "bg-gray-100 border-4 border-gray-200 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 group-hover:border-blue-200"
              }`}>
                {isDragReject ? (
                  <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
                ) : (
                  <Upload className={`h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-200 ${
                    isDragActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"
                  }`} />
                )}
              </div>
              <div className="space-y-3">
                {isDragActive ? (
                  isDragReject ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-red-600 text-sm sm:text-base">
                        Invalid file type
                      </p>
                      <p className="text-xs sm:text-sm text-red-500">
                        Please upload a PDF file only
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-semibold text-blue-600 text-sm sm:text-base">
                        Drop your resume here
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Release to upload your PDF
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">
                      Drag and drop your resume here
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      or <span className="text-blue-600 font-medium">click to browse files</span>
                    </p>
                  </div>
                )}
                <div className="px-3 py-1 bg-gray-100 rounded-full">
                  <p className="text-xs text-gray-500 font-medium">
                    PDF Only • Max 10MB
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200 rounded-2xl animate-in slide-in-from-left-5">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
