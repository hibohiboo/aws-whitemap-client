import { db, serverTimestamp, toSerializeObject } from '@/domain/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { Room } from '../types';
const COLLECTION_NAME = 'online-tool-rooms';
export const create = async (id: string, item: Room, uid: string) => {
  const list = collection(db, COLLECTION_NAME);

  await Promise.all([
    setDoc(doc(list, id), {
      ...item,
      uid,
      createdAt: serverTimestamp(),
    }),
  ]);
  const newRef = await getDoc(doc(list, id));
  const newItem = newRef.data();
  if (!newItem) throw new Error('create failed newItem is empty');
  return { ...newItem, id, createdAt: toSerializeObject(newItem.createdAt) };
};
export const getId = async () => {
  const list = collection(db, COLLECTION_NAME);

  const { id } = await doc(list);
  return id;
};
export const getRooms = async () => {
  const list = await getDocs(
    query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc')),
  );
  const data = [] as any[];
  list.forEach((doc) => {
    data.push(doc.data());
  });
  return data as Room[];
};
