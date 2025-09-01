"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { prepareInstructions } from "@/constants";

export const getCurrentSession = async () => {
  const session = await createSessionClient();
  if (!session) return;
  const { account, databases } = session;
  try {
    const result = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("id", [result.$id])]
    );
    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  const { account } = await createAdminClient();

  try {
    // Create a session using the accountId and OTP code
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Invalid verification code");
  }
};

export const sendEmailAuthenticationCode = async (
  accountId: string,
  email: string
) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(accountId, email);
    return session.userId;
  } catch (error) {
    console.error("Error fetching account ID:", error);
    throw new Error("Failed to fetch account ID");
  }
};

export const getAccount = async (email: string) => {
  const isExistingUser = await getUserByEmail(email);
  if (isExistingUser) {
    await sendEmailAuthenticationCode(isExistingUser.id, email);
    return parseStringify({
      id: isExistingUser.id,
      redirect: false,
    });
  } else {
    return parseStringify({
      id: null,
      redirect: true,
      message: "User does not exist",
    });
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const isExistingUser = await getUserByEmail(email);
  if (isExistingUser) {
    return parseStringify({ redirect: true, message: "User already exists" });
  } else {
    const accountId: string = ID.unique();
    await sendEmailAuthenticationCode(accountId, email);
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        id: accountId,
        name: fullName,
        email: email,
        no_of_analysis_left: 2,
      }
    );
    return parseStringify({
      accountId,
      message: "Account created successfully",
      redirect: false,
    });
  }
};

export const UploadUserResume = async (file: File, user_id: string) => {
  const session = await createSessionClient();
  if (!session) return null;

  const { storage, databases } = session;

  try {
    const uploadResult = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );
    const resume_id = uploadResult.$id;

    // Create a document in analysis collection
    const analysisDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.analysisCollectionId,
      ID.unique(),
      {
        resume_id: resume_id,
      }
    );

    // Get the current analysis for the user
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id
    );

    // Link the created analysis document to the user
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id,
      {
        resume_analysis: [
          ...(userDoc.resume_analysis || []),
          analysisDocument.$id,
        ],
      }
    );

    return {
      success: true,
      resume_id: resume_id,
      documentId: analysisDocument.$id,
    };
  } catch (error) {
    console.error("Error in UploadUserResume:", error);
    // Return a more structured error
    return null;
  }
};

export const UploadResumeimage = async (file: File, resume_id: string) => {
  const session = await createSessionClient();
  if (!session) return null;

  const { storage, databases } = session;

  try {
    const uploadResult = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );
    const resume_img_id = uploadResult.$id;

    // Create a document in analysis collection
    const analysisDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.analysisCollectionId,
      resume_id,
      {
        resume_img: resume_img_id,
      }
    );

    return {
      success: true,
      resume_img_id: resume_img_id,
    };
  } catch (error) {
    console.error("Error in UploadResumeImage:", error);
    // Return a more structured error
    return null;
  }
};

export async function AnalyzePdfFromFile(
  resume: string,
  jobTitle: string,
  jobDescription: string
) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });

  const response = await openai.responses.create({
    model: "gpt-5",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            filename: "resume.pdf",
            file_data: resume,
          },
          {
            type: "input_text",
            text: prepareInstructions({
              jobTitle,
              jobDescription,
            }),
          },
        ],
      },
    ],
  });

  if (!response) {
    return null;
  }

  return response.output_text;
}

export const UpdateResumeAnalysis = async (
  document_id: string,
  analysis: string
) => {
  const session = await createSessionClient();
  if (!session) return null;

  const { databases } = session;

  try {
    // Create a document in analysis collection
    const analysisDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.analysisCollectionId,
      document_id,
      {
        analysis_data: analysis,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in UpdateResumeAnalysis:", error);
    // Return a more structured error
    return null;
  }
};

export const GetResumeDataById = async (resume_id: string) => {
  const session = await createSessionClient();
  if (!session) return null;

  const { databases } = session;

  try {
    const resumeData = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.analysisCollectionId,
      [Query.equal("resume_id", resume_id)]
    );

    if (resumeData.total === 0 || resumeData === null) {
      return null;
    }

    const document = resumeData.documents[0];
    return {
      resume_img: document.resume_img,
      analysis_data: JSON.parse(document.analysis_data),
    };
  } catch (error) {
    console.error("Error in GetResumeDataById:", error);
    return null;
  }
};

export const DeductUserAnalysis = async (user_id: string) => {
  const session = await createSessionClient();
  if (!session) return null;

  const { databases } = session;

  try {
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id
    );

    if (userDoc.no_of_analysis_left > 0) {
      const updatedDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        user_id,
        {
          no_of_analysis_left: userDoc.no_of_analysis_left - 1,
        }
      );
    } else {
      return null;
    }
    return {
      success: true,
      message: "User analysis count updated successfully.",
    };
  } catch (error) {
    console.error("Error in DeductUserAnalysis:", error);
    return null;
  }
};
