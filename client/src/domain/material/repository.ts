import { putBackgroundImage, putBgm } from '@/api/material';
import { clientDomain } from '../aws/constants';
import { createRepository } from './persistance/firestore';
import { MaterialRepository } from './types';

const createUrl = (path: string, uid: string, id: string, ext: string) =>
  `${clientDomain}data/${path}/${uid}/${id}.${ext}`;

export const bgmRepository: MaterialRepository = {
  ...createRepository('bgms'),
  createUrl: (uid: string, id: string, ext: string) =>
    createUrl('bgms', uid, id, ext),
  putFile: putBgm,
};
export const backgroundImagesRepository: MaterialRepository = {
  ...createRepository('background-images'),
  createUrl: (uid: string, id: string, ext: string) =>
    createUrl('background-images', uid, id, ext),
  putFile: putBackgroundImage,
};
