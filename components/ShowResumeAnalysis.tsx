"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  X,
  Award,
  FileText,
  Eye,
  Target,
  Edit,
  Code,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Medal,
} from "lucide-react";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
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

// Modal Component for Zoomed View
const FeedbackModal = ({
  isOpen,
  onClose,
  title,
  icon,
  score,
  tips,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  score: number;
  tips: Tip[];
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen bg-gray-600/60 backdrop-blur-sm p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4 shadow-2xl transition-all duration-300 ${
          isClosing ? 'animate-out zoom-out-95 fade-out-0' : 'animate-in zoom-in-95 duration-300'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl text-white">
                <div className="w-6 h-6 flex items-center justify-center">
                  {icon}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-600">
                  {tips.filter((tip) => tip.type === "good").length} strengths,{" "}
                  {tips.filter((tip) => tip.type === "improve").length}{" "}
                  improvements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressCircle score={score} size={80} strokeWidth={8} />
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`flex gap-4 p-4 rounded-xl border-l-4 ${
                  tip.type === "good"
                    ? "bg-green-50 border-green-500"
                    : "bg-orange-50 border-orange-500"
                } animate-in slide-in-from-left-5 duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 mt-1">
                  {tip.type === "good" ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-lg ${
                      tip.type === "good" ? "text-green-800" : "text-orange-800"
                    }`}
                  >
                    {tip.tip}
                  </p>
                  {tip.explanation && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
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

// Individual Card Component
const FeedbackCard = ({
  title,
  icon,
  score,
  tips,
  onClick,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  score: number;
  tips: Tip[];
  onClick: () => void;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div
      className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
      }`}
      onClick={onClick}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Header with blue theme */}
        <div className="p-6 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <div className="bg-blue-600 rounded-xl p-3 flex items-center justify-center text-white">
                  {icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-600">{score}</div>
              <div className="text-sm opacity-80 text-gray-600">Score</div>
            </div>
          </div>
        </div>

        {/* Content - Fixed height */}
        <div className="p-6 h-80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-full ${getScoreBackground(score)}`}>
                <ProgressCircle score={score} size={60} strokeWidth={6} />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Quick Stats</div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      {tips.filter((tip) => tip.type === "good").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">
                      {tips.filter((tip) => tip.type === "improve").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Tips - Fixed height content */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Preview:
            </h4>
            <div className="space-y-2 max-h-32 overflow-hidden">
              {tips.slice(0, 2).map((tip, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-shrink-0 mt-1">
                    {tip.type === "good" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {tip.tip.length > 80
                      ? tip.tip.substring(0, 80) + "..."
                      : tip.tip}
                  </p>
                </div>
              ))}
              {tips.length > 2 && (
                <p className="text-sm text-gray-500 italic">
                  +{tips.length - 2} more insights...
                </p>
              )}
            </div>
          </div>

          {/* Click indicator - Fixed at bottom */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Click to view details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowResumeAnalysis = ({ feedback }: { feedback: Feedback }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showOverallScore, setShowOverallScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverallScore(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
      icon: <FileText className="h-6 w-6" />,
      score: feedback.ATS.score,
      tips: feedback.ATS.tips,
    },
    {
      key: "content",
      title: "Content Quality",
      icon: <Edit className="h-6 w-6" />,
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      key: "structure",
      title: "Structure & Format",
      icon: <Target className="h-6 w-6" />,
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      key: "toneAndStyle",
      title: "Tone & Style",
      icon: <Eye className="h-6 w-6" />,
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      key: "skills",
      title: "Skills Presentation",
      icon: <Code className="h-6 w-6" />,
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ];

  const selectedSection = sections.find((s) => s.key === selectedCard);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Overall Score Header */}
      <div
        className={`text-center transform transition-all duration-700 ${
          showOverallScore
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-8 bg-white rounded-3xl border-2 border-gray-200 shadow-2xl p-8 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-600 rounded-full text-white mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Overall Resume Score
            </h2>
            <p className="text-gray-600">Your resume analysis results</p>
          </div>
          <div className="flex items-center gap-8">
            <ProgressCircle
              score={feedback.overallScore}
              size={140}
              strokeWidth={12}
            />
            <div
              className={`px-8 py-4 rounded-2xl ${overallGrade.bg} border-2 border-opacity-20`}
            >
              <span className={`text-4xl font-bold ${overallGrade.color}`}>
                {overallGrade.grade}
              </span>
              <p className="text-sm text-gray-600 mt-1">Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section, index) => (
          <FeedbackCard
            key={section.key}
            title={section.title}
            icon={section.icon}
            score={section.score}
            tips={section.tips}
            onClick={() => setSelectedCard(section.key)}
            delay={index * 200}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedSection && (
        <FeedbackModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          title={selectedSection.title}
          icon={selectedSection.icon}
          score={selectedSection.score}
          tips={selectedSection.tips}
        />
      )}

      {/* Summary Stats */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            Analysis Summary
          </h3>
          <p className="text-gray-600">
            Complete breakdown of your resume performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Strengths Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Strengths</h4>
                <p className="text-sm text-gray-600">What you excel at</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {sections.reduce(
                  (acc, section) =>
                    acc +
                    section.tips.filter((tip) => tip.type === "good").length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Strong points found</div>
            </div>
          </div>

          {/* Improvements Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Improvements</h4>
                <p className="text-sm text-gray-600">Areas to enhance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {sections.reduce(
                  (acc, section) =>
                    acc +
                    section.tips.filter((tip) => tip.type === "improve").length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-500">Enhancement opportunities</div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Avg. Score</h4>
                <p className="text-sm text-gray-600">Overall performance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round(
                  sections.reduce((acc, section) => acc + section.score, 0) /
                    sections.length
                )}
              </div>
              <div className="text-sm text-gray-500">Out of 100</div>
            </div>
          </div>

          {/* Grade Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Medal className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Grade</h4>
                <p className="text-sm text-gray-600">Final assessment</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${overallGrade.color}`}>
                {overallGrade.grade}
              </div>
              <div className="text-sm text-gray-500">Letter grade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowResumeAnalysis;
