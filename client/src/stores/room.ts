import { inject, InjectionKey, reactive } from 'vue';
import { useAuthStore } from './auth';
import { create, getRoomId } from '@/domain/room/repository';
import { Room } from '@/domain/room/types';

const initRoomInputDialog = {
  title: '',
  roomId: '',
  tags: '',
  scenarioTitle: '',
  scenarioUrl: '',
  materials: [
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' },
  ],
  displayModal: false,
  isUpdate: false,
};

const roomStore = () => {
  const room = reactive(initRoomInputDialog);

  const openCreateModal = async () => {
    room.title = '';
    room.roomId = '';
    room.scenarioTitle = '';
    room.scenarioUrl = '';
    room.displayModal = true;
    room.isUpdate = false;
    room.tags = 'Coc ココフォリア';
    room.materials = initRoomInputDialog.materials;
    room.roomId = await getRoomId();
  };
  const openEditModal = async (r: Room) => {
    room.title = r.title;
    room.roomId = r.roomId;
    room.scenarioTitle = r.scenarioTitle;
    room.scenarioUrl = r.scenarioUrl;
    room.tags = r.tags;
    room.materials = r.materials;
    room.displayModal = true;
    room.isUpdate = true;
  };
  const closeModal = () => {
    room.displayModal = false;
  };

  return {
    room,
    openCreateModal,
    closeModal,
    openEditModal,
  };
};

export default roomStore;
type RoomStore = ReturnType<typeof roomStore>;

export const roomStoreKey: InjectionKey<RoomStore> = Symbol('roomStore');

export const useRoomStore = () => {
  const store = inject(roomStoreKey);
  if (!store) {
    throw new Error(`${roomStoreKey} is not provided`);
  }
  const { state } = useAuthStore();
  const createRoom = async () => {
    const { roomId, title, tags, scenarioTitle, scenarioUrl, materials } =
      store.room;
    const room = { roomId, title, tags, scenarioTitle, scenarioUrl, materials };
    if (!title) {
      alert('タイトルは必須です');
      return;
    }
    await create(roomId, room, state.uid);
    store.closeModal();
    location.reload();
  };

  return { ...store, createRoom, state };
};
