import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import authStore, { authStoreKey } from '@/stores/auth';
import materialStore, { backgroundImageStoreKey, bgmStoreKey } from './stores/materials';
import sceneStore, { sceneStoreKey } from './stores/scenes';
import { backgroundImagesRepository, bgmRepository } from '@/domain/material/repository';
import { sceneRepository } from '@/domain/scene/repository';

createApp(App)
  .use(router)
  .use(PrimeVue)
  .provide(authStoreKey, authStore())
  .provide(backgroundImageStoreKey, materialStore('背景', backgroundImagesRepository))
  .provide(bgmStoreKey, materialStore('BGM', bgmRepository))
  .provide(sceneStoreKey, sceneStore(sceneRepository))
  .mount('#app');
