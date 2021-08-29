import type { AxiosInstance, AxiosResponse } from 'axios';
import type { StoreBase, TimeStamp } from '../firebase/types';

interface MaterialSite {
  materialSiteName: string;
  materialSiteUrl: string;
  licenseName: string;
  licenseUrl: string;
}

type MaterialBase = MaterialSite & StoreBase;
export type Material = {
  name: string;
  url: string;
  tags: string;
} & MaterialBase;

export interface MaterialRepository {
  update: (id: string, item: Material, uid: string) => Promise<string>;
  create: (id: string, item: Material, uid: string) => Promise<string>;
  getId: () => Promise<string>;
  getItems: () => Promise<Material[]>;
  getItemById: (id: string) => Promise<Material>;
  createUrl: (uid: string, id: string, ext: string) => string;
  putFile: (
    client: AxiosInstance,
    uid: string,
    id: string,
    ext: string,
    file: File,
  ) => Promise<AxiosResponse<any>>;
}
