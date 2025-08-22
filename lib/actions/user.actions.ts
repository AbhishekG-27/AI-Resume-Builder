"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

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
  if (!session) return;

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

    return { success: true, resume_id: resume_id, document: updatedDocument };
  } catch (error) {
    console.error("Error in UploadUserResume:", error);
    // Return a more structured error
    return null;
  }
};
