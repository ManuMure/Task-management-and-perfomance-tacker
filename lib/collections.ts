import type { Document } from "mongodb";
import clientPromise from "./mongo";

export async function getCollection<T extends Document = Document>(name: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection<T>(name);
}