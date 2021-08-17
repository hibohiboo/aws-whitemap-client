import { db, serverTimestamp, toSerializeObject, toTimestamp } from '@/domain/firebase';
import type { TimeStamp } from '@/domain/firebase/types';
import type { Material } from '../../types';

const collectionBackgroundImages = () => db.collection('background-images')

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
  const newItem = newRef.data();
  if (!newItem) throw new Error('create failed newItem is empty');
  return { ...newItem, id, createdAt: toSerializeObject(newItem.createdAt) };
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
