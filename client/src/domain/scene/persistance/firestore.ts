import { db, serverTimestamp, toSerializeObject, toTimestamp } from '@/domain/firebase';
import type { TimeStamp } from '@/domain/firebase/types';
import type { Scene } from '../types';


export const createRepository = (key: string) => {
  const collections = () => db.collection(key)

  const convertFirebaseDocToSerializableObject = (data: any, id: string) => {
    if (!data) throw new Error('create failed data is empty');
    return { ...data, id, createdAt: toSerializeObject(data.createdAt), updatedAt: toSerializeObject(data.updatedAt) };
  }

  const merge = async (id: string, item: Scene, uid: string, createdAt?: TimeStamp) => {
    const list = collections();

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
  // ----
  const create = async (id: string, item: Scene, uid: string) => {
    return merge(id, item, uid)
  };

  const update = async (id: string, item: Scene, uid: string) => {
    return merge(id, item, uid, item.createdAt);
  };
  const getId = async () => {
    const list = collections();

    const { id } = await list.doc();
    return id;
  };
  const getItemById = async (id: string) => {
    const list = collections();

    const doc = await list.doc(id).get();
    return convertFirebaseDocToSerializableObject(doc.data(), id);
  };
  return { create, update, getId, getItemById }
}
