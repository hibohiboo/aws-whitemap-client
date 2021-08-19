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
  const initScene: Scene = {
    id: '',
    uid: '',
    scenarioId: '',
    title: '',
    createdAt: emptyTimeStamp,
    updatedAt: emptyTimeStamp,
    nexts: [],
    bg: null,
    bgm: null,
  }
  const initInputDialog: ModalDialog & Scene = {
    ...initScene,

    displayModal: false,
    isUpdate: false,
  };

  const sceneDialog = reactive(initInputDialog);
  const scene = reactive(initScene);

  const fetchScene = async (id: string) => {
    const item: Scene = await repository.getItemById(id);
    scene.title = item.title;
    scene.id = item.id;
    scene.scenarioId = item.scenarioId;
    scene.uid = item.uid;
    scene.createdAt = item.createdAt;
    scene.updatedAt = item.updatedAt;
    scene.bg = item.bg;
    scene.bgm = item.bgm;
  }

  const openCreateModal = async (scenarioId: string) => {
    sceneDialog.id = await repository.getId();
    sceneDialog.title = '';
    sceneDialog.scenarioId = scenarioId;
    sceneDialog.bgm = null;
    sceneDialog.bg = null;
    sceneDialog.displayModal = true;
    sceneDialog.isUpdate = false;
  };
  const openEditModal = async (item: Scene) => {
    sceneDialog.title = item.title;
    sceneDialog.id = item.id;
    sceneDialog.scenarioId = item.scenarioId;
    sceneDialog.uid = item.uid;
    sceneDialog.createdAt = item.createdAt;
    sceneDialog.updatedAt = item.updatedAt;
    sceneDialog.bg = item.bg;
    sceneDialog.bgm = item.bgm;
    sceneDialog.displayModal = true;
    sceneDialog.isUpdate = true;
  };
  const closeModal = () => {
    sceneDialog.displayModal = false;
  };

  return {
    scene,
    sceneDialog,
    openCreateModal,
    closeModal,
    openEditModal,
    fetchScene
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
