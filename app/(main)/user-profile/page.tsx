"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ResumeCard from "@/components/ResumeCard";
import ScoreCircle from "@/components/ScoreCircle";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [tempName, setTempName] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
    setCurrentUser(user);
    setUserName(user?.name || "");
    setUserResumes(user?.resumes || []);
    
  }, [user, loading, router]);

  // Handle authentication loading and redirect

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  const handleNameEdit = () => {
    if (isEditingName) {
      setUserName(tempName);
    } else {
      setTempName(userName);
    }
    setIsEditingName(!isEditingName);
  };

  const handleNameCancel = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  return (
    <div className="w-full">
      <section className="main-section">
        {/* Profile Header */}
        <div className="page-heading py-8">
          <h1>My Profile</h1>
          <h2>Manage your account and resume analyses</h2>
        </div>

        {/* User Info Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl p-8 gradient-border mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={"/images/auth.webp"}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-blue-500"
                />
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow hover:bg-blue-50">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              <Button variant="outline" className="text-sm">
                Change Photo
              </Button>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-6 w-full text-center lg:text-left">
              {/* Name Section */}
              <div className="space-y-2">
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-2xl font-bold bg-white border-2 border-gray-300 rounded-lg px-3 py-1 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleNameEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNameCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 items-center lg:items-start">
                    <h2 className="text-2xl font-bold text-black">
                      {userName}
                    </h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleNameEdit}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentUser?.no_of_analysis_left}
                  </div>
                  <div className="text-sm text-blue-700">Analyses Left</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {/* {currentUser?.totalAnalyses} */}
                    100
                  </div>
                  <div className="text-sm text-blue-700">Total Analyses</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {userResumes.length}
                  </div>
                  <div className="text-sm text-blue-700">Resumes</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {/* {currentUser?.plan} */}
                    Pro
                  </div>
                  <div className="text-sm text-blue-700">Current Plan</div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Member since:</span>{" "}
                  {currentUser?.createdAt}
                </p>
                <p>
                  <span className="font-medium">Account ID:</span>{" "}
                  {currentUser?.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Upload New Resume
          </Button>
          <Button
            variant="outline"
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Account Settings
          </Button>
          <Button
            variant="outline"
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Download All Resumes
          </Button>
          <Button
            variant="outline"
            className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Upgrade Plan
          </Button>
        </div>

        {/* Resume Analysis Summary */}
        <div className="w-full max-w-4xl bg-white rounded-2xl p-6 gradient-border mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-black mb-2">
                Resume Analysis Overview
              </h3>
              <p className="text-gray-600">
                Track your resume performance and improvements
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {currentUser?.no_of_analysis_left}
                </div>
                <div className="text-sm text-blue-700">Analyses Remaining</div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentUser?.no_of_analysis_left || 0) / 100) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <ScoreCircle
                  score={
                    // Only calculate score for dummy resumes (which have feedback)
                    userResumes.length > 0 && "feedback" in userResumes[0]
                      ? Math.round(
                          (userResumes as Resume[]).reduce(
                            (acc, resume) => acc + resume.analysis_data.overallScore,
                            0
                          ) / userResumes.length
                        )
                      : 85 // Default score for real user data until we have feedback structure
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* My Resumes Section */}
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-black">My Resumes</h3>
              <p className="text-gray-600">
                All your analyzed resumes in one place
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                Sort
              </Button>
            </div>
          </div>

          {userResumes.length > 0 ? (
            <div className="resumes-section">
              {/* Show dummy resumes for now since real user resumes need different structure for ResumeCard */}
              {("feedback" in userResumes[0]
                ? (userResumes as Resume[])
                : userResumes
              ).map((resume) => (
                <ResumeCard key={resume.resume_id} resume={resume} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl gradient-border">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-blue-600 mb-2">
                No resumes yet
              </h3>
              <p className="text-blue-500 mb-4">
                Upload your first resume to get started with AI analysis
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload Resume
              </Button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="w-full max-w-4xl bg-white rounded-2xl p-6 gradient-border mt-8">
          <h3 className="text-xl font-bold text-black mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">
                  Resume analyzed for Google Frontend Developer
                </p>
                <p className="text-sm text-blue-600">
                  2 hours ago • Score: 85/100
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">New resume uploaded</p>
                <p className="text-sm text-blue-600">
                  1 day ago • Apple UI/UX Designer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">
                  Account settings updated
                </p>
                <p className="text-sm text-blue-600">
                  3 days ago • Profile information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
