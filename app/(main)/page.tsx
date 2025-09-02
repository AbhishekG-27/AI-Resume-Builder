"use client";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import ResumeCard from "@/components/ResumeCard";
import { resumes } from "@/constants";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Home() {
  const { user, refreshUser } = useAuth();

  return (
    <div className="w-full">
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Welcome to AutoCv</h1>
          <h2>
            Track and manage your CV Applications with our Smart CV Builder
          </h2>
        </div>
        {/* Template Resumes */}
        {!user && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {/* User resumes */}
        {/* {user && user.resumes.length > 0 && (
          <div className="resumes-section">
            {user.resumes.map((resume) => (
              <ResumeCard key={resume.resume_id} resume={resume} />
            ))}
          </div>
        )} */}
      </section>
      <Pricing />
      <Footer />
    </div>
  );
}
