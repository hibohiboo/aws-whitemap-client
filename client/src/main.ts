import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import authStore, { authStoreKey } from '@/stores/auth';
import roomStore, { roomStoreKey } from './stores/room';

createApp(App)
  .use(PrimeVue)
  .provide(authStoreKey, authStore())
  .provide(roomStoreKey, roomStore())
  .mount('#app');
