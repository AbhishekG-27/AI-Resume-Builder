# AutoCV - AI Resume Analyzer

An intelligent resume analysis application that provides personalized feedback on resumes using AI, tailored to specific job descriptions and titles.

<img width="1902" height="949" alt="image" src="https://github.com/user-attachments/assets/59e85780-1641-4e17-a6da-69ee95e6bee6" />


## Features

- **AI-Powered Resume Analysis**: Leverages OpenAI API to analyze resumes and provide detailed, actionable feedback
- **Job-Specific Feedback**: Generates customized suggestions based on target job description and title
- **Secure Authentication**: Email OTP-based authentication for user login and signup
- **Resume Storage**: Stores user details and uploaded resumes in Appwrite database and object storage
- **Smooth Navigation**: Built with Next.js App Router for seamless user experience
- **Modern UI**: Styled with TailwindCSS for a clean, responsive interface

## Tech Stack

**Frontend:**
- Next.js (App Router)
- React
- TailwindCSS
- React Hook Forms
- Zod (validation)
- Context API

**Backend:**
- Next.js Server Components (TypeScript)
- OpenAI API

**Database & Storage:**
- Appwrite.io (SQL-based database platform)
- Appwrite Storage (Object store)

**Authentication:**
- Email OTP-based authentication

## Prerequisites

Before running this project locally, ensure the following are installed:

- Node.js (v18 or higher)
- npm or yarn
- An OpenAI API key
- An Appwrite account and project

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_APPWRITE_PROJECT_ID = ""
NEXT_PUBLIC_APPWRITE_PROJECT_NAME = ""
NEXT_PUBLIC_APPWRITE_ENDPOINT = ""
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID = ""
NEXT_PUBLIC_APPWRITE_RESUME_ANALYSIS_ID = ""
NEXT_PUBLIC_APPWRITE_DATABASE_ID = ""
NEXT_APPWRITE_BUCKET_ID = ""
NEXT_APPWRITE_SECRET_KEY = ""
NEXT_OPENAI_API_KEY=""
```

## Local Setup

### 1. Clone the Repository
```
git clone https://github.com/AbhishekG-27/AI-Resume-Builder.git
cd autocv
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Appwrite

1. Create an account at [Appwrite.io](https://appwrite.io)
2. Create a new project
3. Set up a database with the following collections:
   - **Users Collection**: Store user details
   - **Resumes Collection**: Store resume metadata and feedback
4. Create a storage bucket for resume file uploads
5. Configure email authentication in Appwrite settings
6. Copy your project credentials to `.env.local`

### 4. Run the Development Server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

1. **Sign Up/Login**: Create an account or login using email OTP authentication
2. **Upload Resume**: Upload your resume in PDF format
3. **Enter Job Details**: Provide the target job title and description
4. **Get Feedback**: Receive AI-generated feedback and suggestions to improve your resume
5. **View History**: Access previously analyzed resumes and feedback


<img width="1904" height="951" alt="image" src="https://github.com/user-attachments/assets/3b630d8e-0edc-4c87-9359-f18a6c5ff37a" />


## Key Features Implementation

### Resume Analysis Flow
1. User uploads resume (PDF format)
2. File is stored in Appwrite Storage
3. Resume metadata saved to Appwrite Database
4. OpenAI API processes resume content against job description
5. Feedback is generated and displayed to user
6. Results are persisted for future reference

### Form Validation
- React Hook Forms handles form state management
- Zod schemas validate user inputs
- Client and server-side validation for security

## Contact

Abhishek Garg - [LinkedIn Profile](https://www.linkedin.com/in/abhishek-garg-9a8ab4235/) | [GitHub Profile](https://github.com/AbhishekG-27)

Project Link: [https://github.com/AbhishekG-27/AI-Resume-Builder](https://github.com/AbhishekG-27/AI-Resume-Builder)

## Acknowledgments

- [OpenAI API](https://openai.com/) for AI-powered resume analysis
- [Appwrite](https://appwrite.io/) for backend services
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling
