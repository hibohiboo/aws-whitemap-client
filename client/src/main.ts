import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import authStore, { authStoreKey } from '@/stores/auth';
import backgroundImageStore, { backgroundImageStoreKey } from './stores/materials/background';

createApp(App)
  .use(PrimeVue)
  .provide(authStoreKey, authStore())
  .provide(backgroundImageStoreKey, backgroundImageStore())
  .mount('#app');
