"use client";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import {
  analyzePdfFromText,
  AnalyzePdfFromUrl,
  fetchFileFromAppwrite,
  UploadResumeimage,
  UploadUserResume,
} from "@/lib/actions/user.actions";
import { useAuth } from "@/lib/contexts/AuthContext";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { extractStructuredPdfText } from "@/lib/pdf2text";

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

  const { user, refreshUser } = useAuth();

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

  const extractTextFromPDF = async (file: File) => {
    if (!pdfjsLib) {
      throw new Error("PDF.js not loaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;

    let fullText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items
        .map((item: TextItem | TextMarkedContent) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .filter((text: string) => text !== "");
      fullText += strings.join(" ") + "\n\n";
    }
    return fullText;
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
      const { resume_id } = response;

      // 2. Convert pdf to image
      setStatusText("Processing your resume...");
      const imageFile = await convertPdfToImage(selectedFile);
      if (!imageFile.file)
        return setStatusText("Failed to convert PDF to image.");

      // 3. upload the image to appwrite bucket
      setStatusText("Uploading resume image...");
      const imageUploadResponse = await UploadResumeimage(
        imageFile.file,
        user_id
      );
      if (!imageUploadResponse)
        return setStatusText("Failed to upload resume image.");

      // Extract the url of the uploaded file.
      setStatusText("Fetching resume data...");
      const resumeUrl = await fetchFileFromAppwrite(resume_id);
      if (!resumeUrl) return setStatusText("Failed to fetch resume data.");
      console.log("resumeUrl", resumeUrl);

      // 4. Call backend API to analyze resume
      setStatusText("Analyzing your resume...");
      // const resumetext = await extractStructuredPdfText(selectedFile, pdfjsLib);
      // if (!resumetext) {
      //   setStatusText("Failed to extract text from resume.");
      //   return;
      // }
      // const analysisResponse = await analyzePdfFromText({
      //   resumeText: resumetext,
      //   jobTitle,
      //   jobDescription,
      // });
      // const analysisResponse = await AnalyzePdfFromUrl(
      //   resumeUrl,
      //   jobTitle,
      //   jobDescription
      // );
      // if (!analysisResponse) {
      //   setStatusText("Failed to analyze resume. Please try again.");
      //   return;
      // }
      // 5. Navigate to the results page using the resume_id
    } catch (error) {
      console.error("Error during resume analysis:", error);
      setStatusText("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
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
            <form
              id="upload-form"
              onSubmit={handleFormSubmit}
              className="w-full max-w-2xl mt-8"
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

              <FileUploader
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />

              <button
                className="primary-button mt-8"
                type="submit"
                disabled={!selectedFile}
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5" />
                  Analyze Resume
                </span>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default UploadResume;
