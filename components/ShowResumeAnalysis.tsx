"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award,
  FileText,
  Eye,
  Target,
  Edit,
  Code,
} from "lucide-react";

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

// Animated Progress Circle Component
const ProgressCircle = ({
  score,
  size = 80,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
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
          stroke={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={`absolute text-xl font-bold ${getScoreColor(score)}`}>
        {Math.round(animatedScore)}
      </span>
    </div>
  );
};

// Individual Section Component
const FeedbackSection = ({
  title,
  icon,
  score,
  tips,
  isExpanded,
  onToggle,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  score: number;
  tips: any[];
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">
                {tips.filter((tip) => tip.type === "good").length} strengths,{" "}
                {tips.filter((tip) => tip.type === "improve").length}{" "}
                improvements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressCircle score={score} size={60} strokeWidth={6} />
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="mt-4 space-y-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`flex gap-3 p-3 rounded-lg transition-all duration-300 transform ${
                  isExpanded
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 mt-1">
                  {tip.type === "good" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      tip.type === "good" ? "text-green-800" : "text-orange-800"
                    }`}
                  >
                    {tip.tip}
                  </p>
                  {tip.explanation && (
                    <p className="text-sm text-gray-600 mt-1">
                      {tip.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowResumeAnalysis = ({ feedback }: { feedback: Feedback }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [showOverallScore, setShowOverallScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverallScore(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getOverallGrade = (score: number) => {
    if (score >= 90)
      return { grade: "A+", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 80)
      return { grade: "A", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 70)
      return { grade: "B", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 60)
      return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { grade: "D", color: "text-red-600", bg: "bg-red-50" };
  };

  const overallGrade = getOverallGrade(feedback.overallScore);

  const sections = [
    {
      key: "ATS",
      title: "ATS Optimization",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      score: feedback.ATS.score,
      tips: feedback.ATS.tips,
    },
    {
      key: "content",
      title: "Content Quality",
      icon: <Edit className="h-5 w-5 text-green-600" />,
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      key: "structure",
      title: "Structure & Format",
      icon: <Target className="h-5 w-5 text-purple-600" />,
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      key: "toneAndStyle",
      title: "Tone & Style",
      icon: <Eye className="h-5 w-5 text-orange-600" />,
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      key: "skills",
      title: "Skills Presentation",
      icon: <Code className="h-5 w-5 text-indigo-600" />,
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Overall Score Header */}
      <div
        className={`text-center transform transition-all duration-700 ${
          showOverallScore
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-6 bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="flex flex-col items-center">
            <Award className="h-8 w-8 text-gray-600 mb-2" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Overall Resume Score
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <ProgressCircle
              score={feedback.overallScore}
              size={120}
              strokeWidth={10}
            />
            <div className={`px-6 py-3 rounded-xl ${overallGrade.bg}`}>
              <span className={`text-3xl font-bold ${overallGrade.color}`}>
                {overallGrade.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Sections */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
        {sections.map((section, index) => (
          <FeedbackSection
            key={section.key}
            title={section.title}
            icon={section.icon}
            score={section.score}
            tips={section.tips}
            isExpanded={expandedSections.has(section.key)}
            onToggle={() => toggleSection(section.key)}
            delay={index * 150}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sections.reduce(
                (acc, section) =>
                  acc +
                  section.tips.filter((tip) => tip.type === "good").length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sections.reduce(
                (acc, section) =>
                  acc +
                  section.tips.filter((tip) => tip.type === "improve").length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Improvements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                sections.reduce((acc, section) => acc + section.score, 0) /
                  sections.length
              )}
            </div>
            <div className="text-sm text-gray-600">Avg. Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${overallGrade.color}`}>
              {overallGrade.grade}
            </div>
            <div className="text-sm text-gray-600">Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowResumeAnalysis;
