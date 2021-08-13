import * as firestore from './persistance/firestore';
import { Room } from './types';

export const create = async (id: string, item: Room, uid: string) =>
  firestore.create(id, item, uid);
export const getRoomId = async () => firestore.getId();
export const getRooms = async () => firestore.getRooms();
