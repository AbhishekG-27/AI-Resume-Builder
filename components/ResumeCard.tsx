import Link from "next/link";
import React from "react";
import ScoreCircle from "./ScoreCircle";
import Image from "next/image";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  return (
    <Link
      href={`/resume/${resume.resume_id}`}
      className="resume-card animate-in fade-in duration-1000"
      target="_blank"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="text-black! font-bold break-words">
            {resume.company_name}
          </h2>
          <h3 className="text-lg break-words text-gray-500">
            {resume.job_title}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={resume.analysis_data.overallScore} />
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <Image
            src={
              !resume.resume_img.includes(".png")
                ? `https://fra.cloud.appwrite.io/v1/storage/buckets/68a81a04000c5881fcaf/files/${resume.resume_img}/view?project=68a6b658001652fae90a`
                : resume.resume_img
            }
            className="w-full h-[400px] max-sm:h-[200px] object-cover object-top"
            alt="resume"
            width={250}
            height={400}
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
