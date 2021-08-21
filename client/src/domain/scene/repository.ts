import { createRepository } from './persistance/firestore';
import { insertSceneLink, updateSceneLink } from './persistance/supabase';
import { SceneRepository, Scene } from './types';

const repository = createRepository('scenes')
export const sceneRepository: SceneRepository = {
  upsert: async (id: string, item: Scene, uid: string, isUpdate: boolean, parentId: string) => {
    const merge = isUpdate ? repository.update : repository.create;
    if (!isUpdate) {
      await insertSceneLink(parentId, id, item.title)
    } else {
      await updateSceneLink(id, item.title)
    }
    return await merge(id, item, uid);
  },
  getId: () => repository.getId(),
  getItemById: (id: string) => repository.getItemById(id),
}
