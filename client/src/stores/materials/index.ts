import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from '../auth';
import { Material, MaterialRepository } from '@/domain/material/types';
import { emptyTimeStamp } from '@/domain/firebase';
import { backgroundImagesRepository, bgmRepository } from '@/domain/material/repository';
import client from '../../api/client';
import { putBackgroundImage } from '@/api/material';
import { getExtension } from '@/domain/file';

interface ModalDialog {
  displayModal: boolean
  isUpdate: boolean
  file: File | null
}



const materialStore = (defaultTag: string, repository: MaterialRepository) => {
  const initMaterialInputDialog: ModalDialog & Material = {
    name: '',
    url: '',
    id: '',
    uid: '',
    tags: '',
    createdAt: emptyTimeStamp,
    updatedAt: emptyTimeStamp,
    materialSiteName: '',
    materialSiteUrl: '',
    licenseName: '',
    licenseUrl: '',

    displayModal: false,
    isUpdate: false,
    file: null
  };
  const materialList = reactive({
    displayModal: false,
  })

  const material = reactive(initMaterialInputDialog);

  const openCreateModal = async () => {
    material.id = await repository.getId();
    material.name = '';
    material.materialSiteName = '';
    material.materialSiteUrl = '';
    material.licenseName = '';
    material.licenseUrl = '';
    material.url = '';
    material.displayModal = true;
    material.isUpdate = false;
    material.tags = defaultTag;
  };
  const openEditModal = async (id: string) => {
    const m: Material = await repository.getItemById(id);
    material.name = m.name;
    material.id = m.id;
    material.materialSiteName = m.materialSiteName;
    material.materialSiteUrl = m.materialSiteUrl;
    material.licenseName = m.licenseName;
    material.licenseUrl = m.licenseUrl;
    material.createdAt = m.createdAt;
    material.updatedAt = m.updatedAt;
    material.tags = m.tags;
    material.url = m.url;
    material.displayModal = true;
    material.isUpdate = true;
  };
  const closeModal = () => {
    material.displayModal = false;
  };
  const openListModal = () => {
    materialList.displayModal = true;
  }
  const closeListModal = () => {
    materialList.displayModal = false;
  }

  return {
    material,
    openCreateModal,
    closeModal,
    openEditModal,
    materialList,
    openListModal,
    closeListModal
  };
};
export default materialStore;

export type MaterialStore = ReturnType<typeof materialStore>;

export const backgroundImageStoreKey: InjectionKey<MaterialStore> = Symbol('backgroundImageStore');
export const bgmStoreKey: InjectionKey<MaterialStore> = Symbol('bgmStore');


const useStore = (store: MaterialStore, repository: MaterialRepository) => {
  const { state } = useAuthStore();
  const upsertMaterial = async () => {
    const { uid } = state;
    const { id, name, url, tags, createdAt, updatedAt, materialSiteName, materialSiteUrl, licenseName, licenseUrl, file, isUpdate } =
      store.material;
    if (!name) {
      alert('名前は必須です');
      return;
    }
    if (!isUpdate && !file) {
      alert('ファイルは必須です')
      return;
    }
    let tmpUrl = url;
    if (file) {
      const ext = getExtension(file.name);
      await repository.putFile(client, uid, id, ext, file);
      tmpUrl = repository.createUrl(uid, id, ext)
    }


    const material = { id, name, url: tmpUrl, uid, tags, createdAt, updatedAt, materialSiteName, materialSiteUrl, licenseName, licenseUrl }

    const merge = store.material.isUpdate ? repository.update : repository.create;
    await merge(id, material, state.uid);
    store.closeModal();
  };
  const fetchList = async () => repository.getItems()

  return { ...store, upsertMaterial, state, fetchList };
}

export const useBackgrounImageStore = () => {
  const store = inject(backgroundImageStoreKey);
  if (!store) {
    throw new Error(`${backgroundImageStoreKey} is not provided`);
  }
  return useStore(store, backgroundImagesRepository);
};
export const useBgmStore = () => {
  const store = inject(bgmStoreKey);
  if (!store) {
    throw new Error(`${bgmStoreKey} is not provided`);
  }

  return useStore(store, bgmRepository);
};
