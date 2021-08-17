import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from '../auth';
import { Material } from '@/domain/material/types';
import { emptyTimeStamp } from '@/domain/firebase';
import { create, getId } from '@/domain/material/background-images/repository';

interface ModalDialog {
  displayModal: boolean
  isUpdate: boolean
}

const initMaterialInputDialog: ModalDialog & Material = {
  name: '',
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
  isUpdate: false
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
  const openEditModal = async (m: Material) => {
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
    const { id, name, tags, materialSiteName, materialSiteUrl, licenseName, licenseUrl } =
      store.bg;
    const bg = { id, name, tags, materialSiteName, materialSiteUrl, licenseName, licenseUrl };
    if (!name) {
      alert('名前は必須です');
      return;
    }
    await create(id, { ...store.bg }, state.uid);
    store.closeModal();
    location.reload();
  };

  return { ...store, createBackgroundImage, state };
};
