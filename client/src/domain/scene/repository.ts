import { createRepository } from './persistance/firestore';
import { SceneRepository, Scene } from './types';

const repository = createRepository('scenes')
export const sceneRepository: SceneRepository = {
  upsert: async (id: string, item: Scene, uid: string, isUpdate: boolean) => {
    const merge = isUpdate ? repository.update : repository.create;
    return await merge(id, item, uid);
  },
  getId: () => repository.getId(),
  getItemById: (id: string) => repository.getItemById(id),
}
