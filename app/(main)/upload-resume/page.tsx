"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import {
  getCurrentSession,
  UploadUserResume,
} from "@/lib/actions/user.actions";

const UploadResume = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const form = event.currentTarget.closest("form");
    if (!form) {
      return;
    }
    setStatusText("Analyzing your resume...");

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
      setStatusText("Uploading your resume...");
      // 1. Upload file to appwrite bucket
      const current_user = await getCurrentSession();
      if (!current_user) return;
      const user_id = current_user.$id;
      const response = await UploadUserResume(selectedFile, user_id);
      if (!response) return;

      // 2. Call backend API to analyze resume
      const { resumeUrl, resume_id } = response;
      // 3. Display results or feedback to user
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
