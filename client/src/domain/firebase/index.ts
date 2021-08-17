import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from './config';
import { TimeStamp } from './types';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// createdAtがserializeではないオブジェクトなのでstringifyを経由することによりserialize化
export const toSerializeObject = (obj: any) => JSON.parse(JSON.stringify(obj));
export const toTimestamp = ({
  seconds,
  nanoseconds,
}: TimeStamp) => new firebase.firestore.Timestamp(Number(seconds), Number(nanoseconds))
export const emptyTimeStamp: TimeStamp = { seconds: '', nanoseconds: '' } as const;