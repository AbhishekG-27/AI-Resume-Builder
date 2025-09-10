"use client";
import ShowResume from "@/components/ShowResume";
// import ShowResume from "@/components/ShowResume";
import { GetResumeById, GetResumeDataById } from "@/lib/actions/user.actions";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Resume = () => {
  const params = useParams();
  const { resume_id } = params;
  const [resumeImage, setResumeImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResumePdf = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await GetResumeDataById(id);
      if (!response) {
        setIsLoading(false);
        console.error("Failed to fetch resume data");
        return;
      }

      const { resume_img, analysis_data } = response;
      setAnalysisData(analysis_data);

      const resume_image_buffer = await GetResumeById(resume_img);
      if (!resume_image_buffer) {
        console.error("Failed to fetch resume image");
        setIsLoading(false);
        return;
      }

      const imageBlob = new Blob([resume_image_buffer], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setResumeImage(imageUrl);
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
      {isLoading && <p>Loading...</p>}
      {!isLoading && resumeImage && analysisData && resume_id && (
        <ShowResume
          resume={{
            id: resume_id.toString(),
            imagePath: resumeImage,
            feedback: analysisData,
          }}
        />
      )}
    </div>
  );
};

export default Resume;
