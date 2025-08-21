export const appwriteConfig = {
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  secretKey: process.env.NEXT_APPWRITE_SECRET_KEY!,
};
