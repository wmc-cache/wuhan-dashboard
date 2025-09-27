import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../pages/Dashboard.vue') },
  { path: '/org', name: 'org', component: () => import('../pages/Org.vue') },
  { path: '/member', name: 'member', component: () => import('../pages/Member.vue') },
  { path: '/laomo', name: 'laomo', component: () => import('../pages/Laomo.vue') },
  { path: '/yiliao', name: 'yiliao', component: () => import('../pages/Yiliao.vue') },
  // 更多 下拉模拟页面
  { path: '/policy', name: 'policy', component: () => import('../pages/Policy.vue') },
  { path: '/training', name: 'training', component: () => import('../pages/Training.vue') },
  { path: '/reports', name: 'reports', component: () => import('../pages/Reports.vue') },
  { path: '/service', name: 'service', component: () => import('../pages/Service.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
