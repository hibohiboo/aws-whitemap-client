import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  serverTimestamp as getServerTimestamp,
  Timestamp,
} from 'firebase/firestore';
import config from './config';
import type { TimeStamp } from './types';

const firebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const serverTimestamp = getServerTimestamp;

// createdAtがserializeではないオブジェクトなのでstringifyを経由することによりserialize化
export const toSerializeObject = (obj: any) => JSON.parse(JSON.stringify(obj));
export const toTimestamp = ({ seconds, nanoseconds }: TimeStamp) =>
  new Timestamp(Number(seconds), Number(nanoseconds));
export const emptyTimeStamp: TimeStamp = {
  seconds: '',
  nanoseconds: '',
} as const;
