import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from './auth';
import { Scene, SceneRepository } from '@/domain/scene/types';
import { emptyTimeStamp } from '@/domain/firebase';
import { sceneRepository } from '@/domain/scene/repository';
import { Material } from '@/domain/material/types';
import { useRouter } from 'vue-router';

interface ModalDialog {
  displayModal: boolean
  isUpdate: boolean
  parentId: string;
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
    parentId: '',
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
    scene.nexts = item.nexts
  }

  const openCreateModal = async (scenarioId: string, parentId: string) => {
    sceneDialog.id = await repository.getId();
    sceneDialog.title = '';
    sceneDialog.scenarioId = scenarioId;
    sceneDialog.bgm = null;
    sceneDialog.bg = null;
    sceneDialog.displayModal = true;
    sceneDialog.isUpdate = false;
    sceneDialog.parentId = parentId;
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

  const updateBgImage = (data: Material) => {
    const { uid, updatedAt, createdAt, id, url, name, materialSiteUrl, materialSiteName, licenseUrl, licenseName, tags } = data;
    sceneDialog.bg = { uid, updatedAt, createdAt, id, name, tags, url, materialSiteUrl, materialSiteName, licenseUrl, licenseName };
  }
  const updateBgm = (data: Material) => {
    const { uid, updatedAt, createdAt, id, url, name, materialSiteUrl, materialSiteName, licenseUrl, licenseName, tags } = data;
    sceneDialog.bgm = { uid, updatedAt, createdAt, id, name, tags, url, materialSiteUrl, materialSiteName, licenseUrl, licenseName };
  }
  const setScene = (item: Scene) => {
    scene.title = item.title;
    scene.id = item.id;
    scene.scenarioId = item.scenarioId;
    scene.uid = item.uid;
    scene.createdAt = item.createdAt;
    scene.updatedAt = item.updatedAt;
    scene.bg = item.bg;
    scene.bgm = item.bgm;
  }

  return {
    scene,
    sceneDialog,
    openCreateModal,
    closeModal,
    openEditModal,
    fetchScene,
    updateBgImage,
    updateBgm,
    setScene
  };
};
export default materialStore;

export type SceneStore = ReturnType<typeof materialStore>;

export const sceneStoreKey: InjectionKey<SceneStore> = Symbol('sceneStore');


const useStore = (store: SceneStore, repository: SceneRepository) => {
  const { state } = useAuthStore();
  const router = useRouter();
  const upsert = async (parentId: string) => {
    const { id, title, scenarioId, nexts, bg, bgm, createdAt, updatedAt, isUpdate } =
      store.sceneDialog;
    const uid = isUpdate ? store.scene.uid : state.uid
    if (!title) {
      alert('タイトルは必須です');
      return;
    }

    const scene = { uid: store.scene.uid, id, title, scenarioId, nexts, bg, bgm, createdAt, updatedAt };
    await repository.upsert(id, scene, uid, isUpdate, store.sceneDialog.parentId);

    store.closeModal();
    store.setScene(scene);
    router.push(`/scene/${id}`)
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
