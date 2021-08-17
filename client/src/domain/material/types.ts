import { TimeStamp } from "../firebase/types";

interface MaterialSite {
  materialSiteName: string;
  materialSiteUrl: string;
  licenseName: string;
  licenseUrl: string;
}
interface UploadUser {
  uid: string;
}
interface StoreInfo {
  id: string;
  updatedAt: TimeStamp;
  createdAt: TimeStamp;
}
type StoreBase = MaterialSite & UploadUser & StoreInfo
export type Material = {
  name: string;
  url: string;
  tags: string;
} & StoreBase;

export interface MaterialRepository {
  update: (id: string, item: Material, uid: string) => Promise<string>
  create: (id: string, item: Material, uid: string) => Promise<string>
  getId: () => Promise<string>
  getItems: () => Promise<Material[]>
  getItemById: (id: string) => Promise<Material>
}
