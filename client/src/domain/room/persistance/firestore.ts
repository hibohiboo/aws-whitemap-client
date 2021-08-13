import { db, serverTimestamp, toSerializeObject } from '@/domain/firebase';
import { Room } from '../types';
const COLLECTION_NAME = 'online-tool-rooms';
export const create = async (id: string, item: Room, uid: string) => {
  const list = db.collection(COLLECTION_NAME);

  await Promise.all([
    list.doc(id).set({
      ...item,
      uid,
      createdAt: serverTimestamp(),
    }),
  ]);
  const newRef = await list.doc(id).get();
  const newItem = newRef.data();
  if (!newItem) throw new Error('create failed newItem is empty');
  return { ...newItem, id, createdAt: toSerializeObject(newItem.createdAt) };
};
export const getId = async () => {
  const list = db.collection(COLLECTION_NAME);

  const { id } = await list.doc();
  return id;
};
export const getRooms = async () => {
  const list = await db
    .collection(COLLECTION_NAME)
    .orderBy('createdAt', 'desc')
    .get();
  const data = [] as any[];
  list.forEach((doc) => {
    data.push(doc.data());
  });
  return data as Room[];
};
