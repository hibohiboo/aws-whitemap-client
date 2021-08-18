import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from './auth';
import { Scene, SceneRepository } from '@/domain/scene/types';
import { emptyTimeStamp } from '@/domain/firebase';
import { sceneRepository } from '@/domain/scene/repository';

interface ModalDialog {
  displayModal: boolean
  isUpdate: boolean
}



const materialStore = (repository: SceneRepository) => {
  const initInputDialog: ModalDialog & Scene = {
    id: '',
    uid: '',
    scenarioId: '',
    title: '',
    createdAt: emptyTimeStamp,
    updatedAt: emptyTimeStamp,
    nexts: [],
    bg: null,
    bgm: null,

    displayModal: false,
    isUpdate: false,
  };

  const scene = reactive(initInputDialog);

  const openCreateModal = async (scenarioId: string) => {
    scene.id = await repository.getId();
    scene.title = '';
    scene.scenarioId = scenarioId;
    scene.bgm = null;
    scene.bg = null;
    scene.displayModal = true;
    scene.isUpdate = false;
    console.log('display', scene)
  };
  const openEditModal = async (id: string) => {
    const item: Scene = await repository.getItemById(id);
    scene.title = item.title;
    scene.id = item.id;
    scene.scenarioId = item.scenarioId;
    scene.uid = item.uid;
    scene.createdAt = item.createdAt;
    scene.updatedAt = item.updatedAt;
    scene.bg = item.bg;
    scene.bgm = item.bgm;
    scene.displayModal = true;
    scene.isUpdate = true;
  };
  const closeModal = () => {
    scene.displayModal = false;
  };

  return {
    scene,
    openCreateModal,
    closeModal,
    openEditModal,
  };
};
export default materialStore;

export type SceneStore = ReturnType<typeof materialStore>;

export const sceneStoreKey: InjectionKey<SceneStore> = Symbol('sceneStore');


const useStore = (store: SceneStore, repository: SceneRepository) => {
  const { state } = useAuthStore();
  const upsert = async () => {
    const { id, title, scenarioId, nexts, bg, bgm, createdAt, updatedAt, isUpdate } =
      store.scene;
    const uid = isUpdate ? store.scene.uid : state.uid
    if (!title) {
      alert('タイトルは必須です');
      return;
    }

    const scene = { uid: store.scene.uid, id, title, scenarioId, nexts, bg, bgm, createdAt, updatedAt };
    await repository.upsert(id, scene, uid, isUpdate);

    store.closeModal();
  };

  return { ...store, upsert, state };
}
export const useSceneStore = () => {
  const store = inject(sceneStoreKey);
  if (!store) {
    throw new Error(`${sceneStoreKey} is not provided`);
  }
  return useStore(store, sceneRepository);
};
