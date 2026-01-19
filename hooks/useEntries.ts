import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../src/firebase";

// 日記＋感情を Firestore に保存
export const createEntry = async (text: string, mood: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("ログインしていません");
  }

  const userId = user.uid;

  const entryRef = doc(collection(db, "users", userId, "entries"));

  await setDoc(entryRef, {
    text,
    mood,
    createdAt: serverTimestamp(),
  });

  return entryRef.id;
};
