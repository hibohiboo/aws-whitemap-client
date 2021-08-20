import type { StoreBase } from "../firebase/types";
import type { Material } from "../material/types";

export type Scene = {
  title: string;
  scenarioId: string
  nexts: string[]
  bgm: Material | null // undefinedはfirebaseは許さない
  bg: Material | null
} & StoreBase;

export interface SceneRepository {
  upsert: (id: string, item: Scene, uid: string, isUpdate: boolean, parentId: string) => Promise<string>
  getId: () => Promise<string>
  getItemById: (id: string) => Promise<Scene>
}
