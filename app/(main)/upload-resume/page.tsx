"use client";
import { useEffect, useRef, useState } from "react";
import { FileText, Eye, X } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import {
  AnalyzePdfFromFile,
  UpdateResumeAnalysis,
  UploadResumeimage,
  UploadUserResume,
} from "@/lib/actions/user.actions";
import { useAuth } from "@/lib/contexts/AuthContext";
import ShowResumeAnalysis from "@/components/ShowResumeAnalysis";
// import { useRouter } from "next/navigation";

interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

const UploadResume = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [isPdfjsLoading, setIsPdfjsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<string>("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const feedbackSectionRef = useRef<HTMLDivElement>(null);

  // const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Auto-scroll when feedback data is set
  useEffect(() => {
    if (analysisData && feedbackSectionRef.current) {
      const timer = setTimeout(() => {
        feedbackSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [analysisData]);

  // Load PDF.js on component mount
  useEffect(() => {
    const loadPdfJs = async () => {
      if (pdfjsLib || isPdfjsLoading) return;

      setIsPdfjsLoading(true);
      try {
        // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
        const lib = await import("pdfjs-dist/build/pdf.mjs");

        // Use CDN for worker
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

        setPdfjsLib(lib);
      } catch (error) {
        console.error("Failed to load PDF.js:", error);
      } finally {
        setIsPdfjsLoading(false);
      }
    };

    loadPdfJs();
  }, [pdfjsLib, isPdfjsLoading]);

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      const url = URL.createObjectURL(selectedFile);
      setPdfPreviewUrl(url);

      // Clean up previous URL
      return () => {
        if (pdfPreviewUrl) {
          URL.revokeObjectURL(pdfPreviewUrl);
        }
      };
    } else {
      setPdfPreviewUrl(null);
    }
  }, [selectedFile]);

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handleRemovePdf = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfPreviewUrl(null);
    setSelectedFile(null);
  };

  const ConvertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const convertPdfToImage = async (
    file: File
  ): Promise<PdfConversionResult> => {
    if (!pdfjsLib) {
      return {
        imageUrl: "",
        file: null,
        error: "PDF.js not loaded",
      };
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 4 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
      }

      await page.render({ canvasContext: context!, viewport }).promise;

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalName = file.name.replace(/\.pdf$/i, "");
              const imageFile = new File([blob], `${originalName}.png`, {
                type: "image/png",
              });

              resolve({
                imageUrl: URL.createObjectURL(blob),
                file: imageFile,
              });
            } else {
              resolve({
                imageUrl: "",
                file: null,
                error: "Failed to create image blob",
              });
            }
          },
          "image/png",
          1.0
        );
      });
    } catch (err) {
      console.error("Error converting PDF to image:", err);
      return {
        imageUrl: "",
        file: null,
        error: `Failed to convert PDF: ${err}`,
      };
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const form = event.currentTarget.closest("form");
    if (!form) {
      return;
    }

    const formData = new FormData(form);

    if (!selectedFile) {
      setStatusText("Please upload your resume.");
      setIsProcessing(false);
      return;
    }

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    try {
      // 1. Upload file to appwrite bucket
      setStatusText("Uploading your resume...");
      const user_id = user.id;
      const response = await UploadUserResume(selectedFile, user_id);
      await refreshUser();
      if (!response) return setStatusText("Failed to upload resume.");
      const { documentId } = response;

      // 2. Convert pdf to image
      setStatusText("Processing your resume...");
      const imageFile = await convertPdfToImage(selectedFile);
      if (!imageFile.file)
        return setStatusText("Failed to convert PDF to image.");

      // 3. upload the image to appwrite bucket
      setStatusText("Uploading resume image...");
      const imageUploadResponse = await UploadResumeimage(
        imageFile.file,
        documentId
      );
      if (!imageUploadResponse)
        return setStatusText("Failed to upload resume image.");

      const pdfData = await ConvertFileToBase64(selectedFile);
      if (!pdfData) return setStatusText("Failed to convert PDF to base64.");

      // 4. Call backend API to analyze resume
      setStatusText("Analyzing your resume...");
      const analysisResponse = await AnalyzePdfFromFile(
        pdfData.toString(),
        jobTitle,
        jobDescription
      );
      if (!analysisResponse) {
        setStatusText("Failed to analyze resume. Please try again.");
        return;
      }

      // 5. Upload the analysis results to the user
      const updateResponse = await UpdateResumeAnalysis(
        documentId,
        analysisResponse
      );
      if (!updateResponse) {
        setStatusText("Failed to update resume analysis.");
        return;
      }
      setAnalysisData(analysisResponse);
    } catch (error) {
      console.error("Error during resume analysis:", error);
      setStatusText("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      // setSelectedFile(null);
      // setPdfPreviewUrl(""); // Clear preview when processing is done
    }
  };

  return (
    <main>
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl">{statusText}</h2>
              </div>
              <div className="w-full max-w-md">
                <img
                  src="/images/resume-scan.gif"
                  alt="Resume scanning animation"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#AB8C95] to-[#8E97C5] h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <h2>Upload your resume for analysis and improvement tips.</h2>
          )}

          {!isProcessing && (
            <div className="w-full max-w-7xl mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="w-full">
                  <form
                    id="upload-form"
                    onSubmit={handleFormSubmit}
                    className="w-full"
                  >
                    <div className="form-div">
                      <label htmlFor="company-name">Company name</label>
                      <input
                        type="text"
                        name="company-name"
                        placeholder="e.g., Google, Microsoft"
                        id="company-name"
                        required
                      />
                    </div>

                    <div className="form-div">
                      <label htmlFor="job-title">Job title</label>
                      <input
                        type="text"
                        name="job-title"
                        placeholder="e.g., Software Engineer"
                        id="job-title"
                        required
                      />
                    </div>

                    <div className="form-div mt-6">
                      <label htmlFor="job-description">Job description</label>
                      <textarea
                        rows={4}
                        name="job-description"
                        placeholder="Paste the job description here..."
                        id="job-description"
                        required
                      />
                    </div>

                    <button
                      className="primary-button mt-8 w-full"
                      type="submit"
                      disabled={!selectedFile}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5" />
                        Analyze Resume
                      </span>
                    </button>
                  </form>
                </div>

                {/* PDF Upload/Preview Section */}
                <div className="w-full">
                  <div className="sticky top-8">
                    {!selectedFile && !pdfPreviewUrl ? (
                      // Upload Section
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-medium text-gray-800">
                            Upload Resume
                          </h3>
                        </div>
                        <FileUploader
                          selectedFile={selectedFile}
                          setSelectedFile={setSelectedFile}
                        />
                      </div>
                    ) : (
                      // Preview Section
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-medium text-gray-800">
                              Resume Preview
                            </h3>
                          </div>
                          <button
                            onClick={handleRemovePdf}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <p className="text-sm text-gray-600 truncate">
                              {selectedFile?.name}
                            </p>
                          </div>
                          <div className="p-4">
                            <iframe
                              src={pdfPreviewUrl || undefined}
                              className="w-full h-96 md:h-[500px] lg:h-[600px] border-0 rounded-lg"
                              title="PDF Preview"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {analysisData && (
        <section ref={feedbackSectionRef} className="mt-6 border-t-2 py-5">
          <ShowResumeAnalysis feedback={JSON.parse(analysisData)} />
        </section>
      )}
    </main>
  );
};

export default UploadResume;
