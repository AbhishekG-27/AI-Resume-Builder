"use client";
import { useParams } from "next/navigation";

const Resume = () => {
  const { id } = useParams();

  return <div>Resume {id}</div>;
};

export default Resume;
