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
  tags: string;
} & StoreBase;
