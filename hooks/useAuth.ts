import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../src/firebase"; // Firestoreもインポート

// サインアップ（ユーザー作成＋Firestore保存）
export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Firestore にユーザー情報を保存
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date()
  });

  return userCredential;
};

// サインイン（そのまま）
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

