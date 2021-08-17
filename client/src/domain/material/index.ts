import { clientDomain } from "../aws/constants";

export const createBackgroundImageUrl = (uid: string, id: string, ext: string) => `${clientDomain}data/background-images/${uid}/${id}.${ext}`