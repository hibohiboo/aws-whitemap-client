import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import authStore, { authStoreKey } from '@/stores/auth';
import materialStore, { backgroundImageStoreKey, bgmStoreKey } from './stores/materials';
import { backgroundImagesRepository, bgmRepository } from '@/domain/material/repository';

createApp(App)
  .use(PrimeVue)
  .provide(authStoreKey, authStore())
  .provide(backgroundImageStoreKey, materialStore('背景', backgroundImagesRepository))
  .provide(bgmStoreKey, materialStore('BGM', bgmRepository))
  .mount('#app');
