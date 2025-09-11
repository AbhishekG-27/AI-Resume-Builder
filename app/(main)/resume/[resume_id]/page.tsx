"use client";
import ShowResume from "@/components/ShowResume";
// import ShowResume from "@/components/ShowResume";
import { GetResumeById, GetResumeDataById } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Resume = () => {
  const params = useParams();
  const { resume_id } = params;
  const [resumeImage, setResumeImage] = useState<string | null>(null);
  const [resumePdf, setResumePdf] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);

  const fetchResumePdf = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await GetResumeDataById(id);
      if (!response) {
        setIsLoading(false);
        console.error("Failed to fetch resume data");
        return;
      }

      const { resume_img, analysis_data, resume_pdf, company_name, job_title } =
        response;
      setAnalysisData(analysis_data);
      setCompanyName(company_name);
      setJobTitle(job_title);

      const resume_image_buffer = await GetResumeById(resume_img);
      const resume_pdf_buffer = await GetResumeById(resume_pdf);
      if (!resume_image_buffer || !resume_pdf_buffer) {
        console.error("Failed to fetch resume image or PDF");
        setIsLoading(false);
        return;
      }

      const imageBlob = new Blob([resume_image_buffer], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      const pdfBlob = new Blob([resume_pdf_buffer], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumeImage(imageUrl);
      setResumePdf(pdfUrl);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching resume details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resume_id) {
      fetchResumePdf(resume_id.toString());
    }
  }, [resume_id]);
  return (
    <div>
      {isLoading && (
        <div className="w-full flex items-center justify-center overflow-hidden flex-col py-10">
          <div className="w-full max-w-md">
            <Image
              src="/images/resume-scan.gif"
              alt="Resume scanning animation"
              width={200}
              height={100}
              className="w-full h-auto rounded-2xl"
              unoptimized={true}
            />
          </div>
          <div className="text-gray-600 text-lg font-medium">
            Fetching your resume details...
          </div>
        </div>
      )}
      {!isLoading &&
        resumeImage &&
        analysisData &&
        resume_id &&
        resumePdf &&
        companyName &&
        jobTitle && (
          <ShowResume
            resume={{
              id: resume_id.toString(),
              imagePath: resumeImage,
              feedback: analysisData,
              pdfPath: resumePdf,
              companyName: companyName,
              jobTitle: jobTitle,
            }}
          />
        )}
    </div>
  );
};

export default Resume;
