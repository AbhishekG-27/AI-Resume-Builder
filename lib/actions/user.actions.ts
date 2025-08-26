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
        resume_id: null,
        resume_img: null,
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

    // 2. Fetch the current user's document
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id
    );

    // 3. Update the array of resume IDs
    // Get the existing array, or initialize a new one if it doesn't exist
    const existingResumeIds = userDoc.resume_id || [];
    const updatedResumeIds = [...existingResumeIds, resume_id];

    // 4. Save the entire updated array back to the user's document
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id,
      {
        resume_id: updatedResumeIds, // Overwrite with the new, complete array
      }
    );

    return {
      success: true,
      resume_id: resume_id,
      document: updatedDocument,
    };
  } catch (error) {
    console.error("Error in UploadUserResume:", error);
    // Return a more structured error
    return null;
  }
};

export const UploadResumeimage = async (file: File, user_id: string) => {
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

    // 2. Fetch the current user's document
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id
    );

    // 3. Update the array of resume image IDs
    // Get the existing array, or initialize a new one if it doesn't exist
    const existingResumeImgIds = userDoc.resume_img || [];
    const updatedResumeImgIds = [...existingResumeImgIds, resume_img_id];

    // 4. Save the entire updated array back to the user's document
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user_id,
      {
        resume_img: updatedResumeImgIds, // Overwrite with the new, complete array
      }
    );

    return {
      success: true,
      resume_img_id: resume_img_id,
      document: updatedDocument,
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

export async function AnalyzePdfFromUrl(
  resumeUrl: string,
  jobTitle: string,
  jobDescription: string
) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });
  try {
    const response = await openai.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prepareInstructions({
                jobTitle,
                jobDescription,
              }),
            },
            {
              type: "input_file",
              file_url: resumeUrl,
            },
          ],
        },
      ],
    });

    if (!response) {
      return null;
    }
    return response.output_text;
  } catch (error) {
    console.error("Error in analyzePdfFromUrl:", error);
    return null;
  }
}
