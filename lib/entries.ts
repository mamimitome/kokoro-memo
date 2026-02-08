import { auth, db } from "@/src/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

// ① Entry追加
export async function addEntry({
  text,
  emotion,
  date,
}: {
  text: string;
  emotion: { label: string; value: string };
  date: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = collection(db, "users", user.uid, "entries");

  await addDoc(ref, {
    text,
    emotion,
    date,
    createdAt: serverTimestamp(),
  });
}



// ② リアルタイム取得（一覧）
export function listenEntries(callback: (items: any[]) => void) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = collection(db, "users", user.uid, "entries");
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => {
      const data = d.data();
      const createdAt =
        data.createdAt?.toDate?.() ??
        (typeof data.createdAt === "string" ? new Date(data.createdAt) : null);

      return {
        id: d.id,
        ...data,
        createdAt,
      };
    });

    callback(items);
  });
}


// ③ 一覧取得（静的）
export async function getEntries() {
  const user = auth.currentUser;
  if (!user) return [];

  const ref = collection(db, "users", user.uid, "entries");
  const q = query(ref, orderBy("createdAt", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt =
      data.createdAt?.toDate?.() ??
      (typeof data.createdAt === "string" ? new Date(data.createdAt) : null);

    return {
      id: d.id,
      ...data,
      createdAt,
    };
  });
}


// ④ 単体取得
export async function getEntry(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = doc(db, "users", user.uid, "entries", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    ...data,
    createdAt:
      data.createdAt?.toDate?.() ??
      (typeof data.createdAt === "string" ? new Date(data.createdAt) : null),
  };
}

//一覧で label を探す関数を追加

export function emotionToLabel(value: string) {
  const found = EMOTIONS.find(e => e.value === value);
  return found?.label ?? "❓";
}

