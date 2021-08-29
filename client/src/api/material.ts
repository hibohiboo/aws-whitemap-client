import type { AxiosInstance } from 'axios';

export const putBackgroundImage = async (
  client: AxiosInstance,
  uid: string,
  id: string,
  ext: string,
  file: File,
) => {
  return await client.put(
    `users/${uid}/files/background-images/${id}.${ext}`,
    file,
    { headers: { 'content-type': file.type } },
  );
};
export const putBgm = async (
  client: AxiosInstance,
  uid: string,
  id: string,
  ext: string,
  file: File,
) => {
  return await client.put(`users/${uid}/files/bgms/${id}.${ext}`, file, {
    headers: { 'content-type': file.type },
  });
};
