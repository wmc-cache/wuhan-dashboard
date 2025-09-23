import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../pages/Dashboard.vue') },
  { path: '/org', name: 'org', component: () => import('../pages/Org.vue') },
  { path: '/member', name: 'member', component: () => import('../pages/Member.vue') },
  { path: '/laomo', name: 'laomo', component: () => import('../pages/Laomo.vue') },
  { path: '/yiliao', name: 'yiliao', component: () => import('../pages/Yiliao.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

