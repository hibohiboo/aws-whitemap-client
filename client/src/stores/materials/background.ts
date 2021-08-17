import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from '../auth';
import { Material } from '@/domain/material/types';
import { emptyTimeStamp } from '@/domain/firebase';
import { create, getId, getItemById, update } from '@/domain/material/background-images/repository';
import client from '../../api/client';
import { createBackgroundImageUrl } from '@/domain/material';
import { putBackgroundImage } from '@/api/material';
import { getExtension } from '@/domain/file';

interface ModalDialog {
  displayModal: boolean
  isUpdate: boolean
  file: File | null
}

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

const backgroundImageStore = () => {
  const material = reactive(initMaterialInputDialog);

  const openCreateModal = async () => {
    material.id = await getId();
    material.name = '';
    material.materialSiteName = '';
    material.materialSiteUrl = '';
    material.licenseName = '';
    material.licenseUrl = '';
    material.displayModal = true;
    material.isUpdate = false;
    material.tags = '背景';
  };
  const openEditModal = async (id: string) => {
    const m: Material = await getItemById(id);
    material.name = m.name;
    material.id = m.id;
    material.materialSiteName = m.materialSiteName;
    material.materialSiteUrl = m.materialSiteUrl;
    material.licenseName = m.licenseName;
    material.licenseUrl = m.licenseUrl;
    material.createdAt = m.createdAt;
    material.updatedAt = m.updatedAt;
    material.tags = m.tags;
    material.displayModal = true;
    material.isUpdate = true;
  };
  const closeModal = () => {
    material.displayModal = false;
  };

  return {
    bg: material,
    openCreateModal,
    closeModal,
    openEditModal,
  };
};

export default backgroundImageStore;
type BackgroundImageStore = ReturnType<typeof backgroundImageStore>;

export const backgroundImageStoreKey: InjectionKey<BackgroundImageStore> = Symbol('backgroundImageStore');


export const useBackgrounImageStore = () => {
  const store = inject(backgroundImageStoreKey);
  if (!store) {
    throw new Error(`${backgroundImageStoreKey} is not provided`);
  }
  const { state } = useAuthStore();
  const createBackgroundImage = async () => {
    const { uid } = state;
    const { id, name, tags, createdAt, updatedAt, materialSiteName, materialSiteUrl, licenseName, licenseUrl, file } =
      store.bg;
    if (!name) {
      alert('名前は必須です');
      return;
    }
    if (!file) {
      alert('ファイルは必須です')
      return;
    }

    const ext = getExtension(file.name);
    await putBackgroundImage(client, uid, id, ext, file);
    const url = createBackgroundImageUrl(uid, id, ext)
    const material = { id, name, url, uid, tags, createdAt, updatedAt, materialSiteName, materialSiteUrl, licenseName, licenseUrl }

    const merge = store.bg.isUpdate ? update : create;
    await merge(id, material, state.uid);
    store.closeModal();
  };

  return { ...store, createBackgroundImage, state };
};
