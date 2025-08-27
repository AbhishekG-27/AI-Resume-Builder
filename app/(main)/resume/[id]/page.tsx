"use client";
import { GetResumeDataById } from "@/lib/actions/user.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Resume = () => {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState<Feedback | null>(null);

  const GetResumeData = async () => {
    if (!id) return;
    const result = await GetResumeDataById(id?.toString());
    if (!result) return;
    setAnalysisData(result.analysis_data);
    console.log("Resume Data:", result.analysis_data);
  };

  useEffect(() => {
    GetResumeData();
  }, [id]);

  return <div>{analysisData?.skills.score}</div>;
};

export default Resume;
