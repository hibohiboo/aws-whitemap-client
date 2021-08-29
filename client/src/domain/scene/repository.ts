import { createRepository } from './persistance/firestore';
import {
  insertSceneLink,
  selectSceneLink,
  updateSceneLink,
} from './persistance/supabase';
import { SceneRepository, Scene } from './types';

const repository = createRepository('scenes');
export const sceneRepository: SceneRepository = {
  upsert: async (
    id: string,
    item: Scene,
    uid: string,
    isUpdate: boolean,
    parentId: string,
  ) => {
    const merge = isUpdate ? repository.update : repository.create;
    if (!isUpdate) {
      await insertSceneLink(parentId, id, item.title);
    } else {
      await updateSceneLink(id, item.title);
    }
    return await merge(id, item, uid);
  },
  getId: () => repository.getId(),
  getItemById: async (id: string) => {
    const item = await repository.getItemById(id);
    const nexts = await selectSceneLink(id);
    // descriptionは後から追加したプロパティなので、ない場合には''で初期化する
    return { ...item, description: item.description || '', nexts };
  },
};
