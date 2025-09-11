"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Award,
  FileText,
  Eye,
  Target,
  Code,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  Star,
  BarChart3,
  Brain,
  MessageSquare,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreCircle from "./ScoreCircle";
import Link from "next/link";

// Type definitions
interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  pdfPath: string;
  feedback: Feedback;
}

interface ShowResumeProps {
  resume: Resume;
  className?: string;
}

// Enhanced Progress Circle with Animation
const AnimatedProgressCircle = ({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  icon,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  icon: React.ReactNode;
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return { bg: "bg-green-500", text: "text-green-600", stroke: "#10B981" };
    if (score >= 60)
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-600",
        stroke: "#F59E0B",
      };
    return { bg: "bg-red-500", text: "text-red-600", stroke: "#EF4444" };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative inline-flex flex-col items-center justify-center group">
      <div className="relative">
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className={`p-2 rounded-full ${colors.bg} bg-opacity-20`}>
            <div className={`w-6 h-6 ${colors.text} flex items-center justify-center`}>{icon}</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${colors.text} leading-none`}>
              {Math.round(animatedScore)}
            </div>
            <div className="text-[10px] text-gray-500 leading-none">/ 100</div>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 mt-2 text-center">
        {label}
      </p>
    </div>
  );
};

// Tip Card Component
const TipCard = ({
  tip,
  index,
}: {
  tip: { type: "good" | "improve"; tip: string; explanation?: string };
  index: number;
}) => {
  const isGood = tip.type === "good";

  return (
    <div
      className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer animate-in slide-in-from-bottom-5 ${
        isGood
          ? "border-green-200 bg-green-50 hover:bg-green-100"
          : "border-orange-200 bg-orange-50 hover:bg-orange-100"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 mt-1 p-1 rounded-full ${
            isGood ? "bg-green-500" : "bg-orange-500"
          }`}
        >
          {isGood ? (
            <CheckCircle className="h-4 w-4 text-white" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`font-semibold text-sm ${
              isGood ? "text-green-800" : "text-orange-800"
            }`}
          >
            {tip.tip}
          </p>
          {tip.explanation && (
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">
              {tip.explanation}
            </p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard = ({
  title,
  icon,
  score,
  tips,
  isExpanded,
  onToggle,
  color = "blue",
}: {
  title: string;
  icon: React.ReactNode;
  score: number;
  tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
  isExpanded: boolean;
  onToggle: () => void;
  color?: string;
}) => {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    purple: "border-purple-200 bg-purple-50 hover:bg-purple-100",
    green: "border-green-200 bg-green-50 hover:bg-green-100",
    orange: "border-orange-200 bg-orange-50 hover:bg-orange-100",
    indigo: "border-indigo-200 bg-indigo-50 hover:bg-indigo-100",
  };

  const goodTips = tips.filter((tip) => tip.type === "good");
  const improveTips = tips.filter((tip) => tip.type === "improve");

  return (
    <div
      className={`border rounded-xl transition-all duration-300 ${
        colorClasses[color as keyof typeof colorClasses]
      } ${isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md"}`}
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <div className="w-6 h-6 text-blue-600">{icon}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">
                {goodTips.length} strengths • {improveTips.length} improvements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreCircle score={score} />
            <ChevronRight
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6 animate-in slide-in-from-top-5 duration-300">
          <div className="grid md:grid-cols-2 gap-4">
            {goodTips.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Strengths ({goodTips.length})
                </h4>
                <div className="space-y-3">
                  {goodTips.map((tip, index) => (
                    <TipCard key={index} tip={tip} index={index} />
                  ))}
                </div>
              </div>
            )}
            {improveTips.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Improvements ({improveTips.length})
                </h4>
                <div className="space-y-3">
                  {improveTips.map((tip, index) => (
                    <TipCard key={index} tip={tip} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShowResume({
  resume,
  className = "",
}: ShowResumeProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSectionToggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const { feedback } = resume;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 ${className}`}
    >
      {/* Header Section */}
      <div
        className={`bg-white border-b border-gray-200 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resume Analysis
                </h1>
                {resume.jobTitle && resume.companyName && (
                  <p className="text-gray-600">
                    {resume.jobTitle} at {resume.companyName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <ZoomIn className="h-4 w-4 mr-2" />
                Full Screen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resume Display - Sticky */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="sticky top-6 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Resume Preview
                </h2>
              </div>
              <div className="p-4 flex items-center justify-center hover:scale-[1.01] transition-transform duration-300">
                <Link
                  href={resume.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={resume.imagePath}
                    alt="Resume Preview"
                    width={500}
                    height={600}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm border border-gray-200"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div
            className={`space-y-6 transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            {/* Overall Score */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  Overall Performance
                </h2>
                <div className="flex justify-center mb-4">
                  <AnimatedProgressCircle
                    score={feedback.overallScore}
                    size={140}
                    strokeWidth={12}
                    label="Overall Score"
                    icon={<BarChart3 className="h-6 w-6" />}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Grade</p>
                    <p className="font-semibold text-lg">
                      {feedback.overallScore >= 90
                        ? "A+"
                        : feedback.overallScore >= 80
                        ? "A"
                        : feedback.overallScore >= 70
                        ? "B"
                        : feedback.overallScore >= 60
                        ? "C"
                        : "D"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Rank</p>
                    <p className="font-semibold text-lg">
                      {feedback.overallScore >= 80
                        ? "Excellent"
                        : feedback.overallScore >= 60
                        ? "Good"
                        : "Needs Work"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <AnimatedProgressCircle
                  score={feedback.ATS.score}
                  size={100}
                  strokeWidth={8}
                  label="ATS Score"
                  icon={<Target className="h-5 w-5" />}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <AnimatedProgressCircle
                  score={feedback.content.score}
                  size={100}
                  strokeWidth={8}
                  label="Content"
                  icon={<FileText className="h-5 w-5" />}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <AnimatedProgressCircle
                  score={feedback.toneAndStyle.score}
                  size={100}
                  strokeWidth={8}
                  label="Tone & Style"
                  icon={<MessageSquare className="h-5 w-5" />}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <AnimatedProgressCircle
                  score={feedback.skills.score}
                  size={100}
                  strokeWidth={8}
                  label="Skills"
                  icon={<Code className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Detailed Analysis Sections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Detailed Analysis
              </h3>

              <SectionCard
                title="ATS Compatibility"
                icon={<Target className="h-6 w-6" />}
                score={feedback.ATS.score}
                tips={feedback.ATS.tips}
                isExpanded={expandedSection === "ats"}
                onToggle={() => handleSectionToggle("ats")}
                color="blue"
              />

              <SectionCard
                title="Content Quality"
                icon={<FileText className="h-6 w-6" />}
                score={feedback.content.score}
                tips={feedback.content.tips}
                isExpanded={expandedSection === "content"}
                onToggle={() => handleSectionToggle("content")}
                color="green"
              />

              <SectionCard
                title="Tone & Style"
                icon={<MessageSquare className="h-6 w-6" />}
                score={feedback.toneAndStyle.score}
                tips={feedback.toneAndStyle.tips}
                isExpanded={expandedSection === "tone"}
                onToggle={() => handleSectionToggle("tone")}
                color="purple"
              />

              <SectionCard
                title="Structure & Format"
                icon={<Layers className="h-6 w-6" />}
                score={feedback.structure.score}
                tips={feedback.structure.tips}
                isExpanded={expandedSection === "structure"}
                onToggle={() => handleSectionToggle("structure")}
                color="indigo"
              />

              <SectionCard
                title="Skills & Keywords"
                icon={<Code className="h-6 w-6" />}
                score={feedback.skills.score}
                tips={feedback.skills.tips}
                isExpanded={expandedSection === "skills"}
                onToggle={() => handleSectionToggle("skills")}
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
