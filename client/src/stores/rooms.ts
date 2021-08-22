import { onMounted, reactive } from 'vue';
import { getRooms } from '@/domain/room/repository';

const init = [
  {
    roomId: 'BFyhWIoASo9ou6a5CXxK',
    title: 'aaa',
    uid: '1YqpA1hcNAXfL0QpOW9O6OkpRIj1',
  },
  {
    roomId: 'BFyhWIoASo9ou6a5CXxK',
    title: 'aaa',
    uid: '1YqpA1hcNAXfL0QpOW9O6OkpRIj1',
  },
  {
    roomId: 'BFyhWIoASo9ou6a5CXxK',
    title: 'aaa',
    uid: '1YqpA1hcNAXfL0QpOW9O6OkpRIj1',
  },
  {
    roomId: 'BFyhWIoASo9ou6a5CXxK',
    title: 'aaa',
    uid: '1YqpA1hcNAXfL0QpOW9O6OkpRIj1',
  },
  {
    roomId: 'BFyhWIoASo9ou6a5CXxK',
    title: 'aaa',
    uid: '1YqpA1hcNAXfL0QpOW9O6OkpRIj1',
  },
];
const roomsStore = () => {
  const rooms = reactive({ list: [] as any });
  onMounted(async () => {
    rooms.list = await getRooms();
  });
  return {
    rooms,
  };
};
export default roomsStore;
