"use client";
import PDFViewer from "@/components/PdfViewer";
import ResumeReorder from "@/components/ResumeSectionEditor";
import {
  ExtractResumeSections,
  GetResumeById,
} from "@/lib/actions/user.actions";
import { createSingleColumnResumePDF } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ResumeEnhance = () => {
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeSections, setResumeSections] = useState<
    { key: string; value: string }[]
  >([]);

  useEffect(() => {
    const currentId = id?.toString() || "";

    const fetchResumeData = async () => {
      if (!currentId) {
        setError("No resume ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const resumeData = await GetResumeById(currentId);
        if (!resumeData) {
          setError("Failed to fetch resume data");
          console.error("No resume data returned from GetResumeById");
          return;
        }

        // Create blob URL for PDF display
        const blob = new Blob([resumeData], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);

        // Make the API call to chatgpt for extracting the sections from the resume.
        // Convert ArrayBuffer to Base64
        const uint8Array = new Uint8Array(resumeData);
        const binaryString = Array.from(uint8Array, (byte) =>
          String.fromCharCode(byte)
        ).join("");
        const base64String = btoa(binaryString);
        const sections = await ExtractResumeSections(base64String.toString());
        if (!sections) {
          setError("Failed to extract resume sections");
          return;
        }
        const extractedSections: { key: string; value: string }[] =
          await JSON.parse(sections);
        setResumeSections(extractedSections);
        // const pdfbytes = await createSingleColumnResumePDF(extractedSections, [
        //   "contact",
        //   "summary",
        //   "experience",
        //   "education",
        //   "skills",
        //   "projects",
        // ]);
        // const enhancedBlob = new Blob([pdfbytes], { type: "application/pdf" });
        // const enhancedUrl = URL.createObjectURL(enhancedBlob);
        // setResumeUrl(enhancedUrl);
        // setResumeSections(sections);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id]); // Remove resumeUrl dependency to avoid infinite loop

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, [resumeUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading your resume...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {resumeSections && !loading && !error && (
          <ResumeReorder {...resumeSections} />
        )}
      </div>
    </div>
  );
};

export default ResumeEnhance;
