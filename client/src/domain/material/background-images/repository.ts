import { Material } from '../types';
import * as firestore from './persistance/firestore';


export const update = async (id: string, item: Material, uid: string) =>
  firestore.update(id, item, uid);
export const create = async (id: string, item: Material, uid: string) =>
  firestore.create(id, item, uid);
export const getId = async () => firestore.getId();
export const getBackgroundImages = async () => firestore.getBackgroundImages();
export const getItemById = async (id: string) => firestore.getItemById(id) as Promise<Material>