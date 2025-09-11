interface Resume {
  company_name?: string;
  job_title?: string;
  resume_img: string;
  resume_id: string;
  analysis_data: Feedback;
}

interface User {
  id: string;
  name: string;
  email: string;
  resumes: {
    analysis_data: Feedback;
    resume_id: string;
    resume_img: string;
    company_name: string;
    job_title: string;
  }[];
  no_of_analysis_left: number;
  createdAt: string;
  // Add other user properties from your database
}

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
