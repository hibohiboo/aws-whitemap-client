import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Top',
    component: import('../components/pages/Top.vue'),
  },
  {
    path: '/scene/:id',
    name: 'Scene',
    component: () => import('../components/pages/Scene.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
