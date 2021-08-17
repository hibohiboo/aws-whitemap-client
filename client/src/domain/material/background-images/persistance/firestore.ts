import { db, serverTimestamp, toSerializeObject, toTimestamp } from '@/domain/firebase';
import type { TimeStamp } from '@/domain/firebase/types';
import type { Material } from '../../types';

const collectionBackgroundImages = () => db.collection('background-images')

const convertFirebaseDocToSerializableObject = (data: any, id: string) => {
  if (!data) throw new Error('create failed data is empty');
  return { ...data, id, createdAt: toSerializeObject(data.createdAt), updatedAt: toSerializeObject(data.updatedAt) };
}

const merge = async (id: string, item: Material, uid: string, createdAt?: TimeStamp) => {
  const list = collectionBackgroundImages();

  await Promise.all([
    list.doc(id).set({
      ...item,
      uid,
      createdAt: createdAt ? toTimestamp(createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  ]);
  const newRef = await list.doc(id).get();
  return convertFirebaseDocToSerializableObject(newRef.data(), id);
}

export const create = async (id: string, item: Material, uid: string) => {
  return merge(id, item, uid)
};

export const update = async (id: string, item: Material, uid: string) => {
  return merge(id, item, uid, item.createdAt);
};
export const getId = async () => {
  const list = collectionBackgroundImages();

  const { id } = await list.doc();
  return id;
};
export const getBackgroundImages = async () => {
  const list = await collectionBackgroundImages()
    .orderBy('createdAt', 'desc')
    .get();

  return list.docs.map((doc) => doc.data()) as Material[];
};
export const getItemById = async (id: string) => {
  const list = collectionBackgroundImages();

  const doc = await list.doc(id).get();
  return convertFirebaseDocToSerializableObject(doc.data(), id);
};