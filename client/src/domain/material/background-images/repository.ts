import { Material } from '../types';
import * as firestore from './persistance/firestore';


export const create = async (id: string, item: Material, uid: string) =>
  firestore.create(id, item, uid);
export const getId = async () => firestore.getId();
export const getBackgroundImages = async () => firestore.getBackgroundImages();
