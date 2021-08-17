import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import authStore, { authStoreKey } from '@/stores/auth';
import materialStore, { backgroundImageStoreKey } from './stores/materials';
import * as backgroundRepository from '@/domain/material/background-images/repository';

createApp(App)
  .use(PrimeVue)
  .provide(authStoreKey, authStore())
  .provide(backgroundImageStoreKey, materialStore('背景', backgroundRepository))
  .mount('#app');
