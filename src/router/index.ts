import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../pages/Dashboard.vue') },
  { path: '/org', name: 'org', component: () => import('../pages/Org.vue') },
  { path: '/member', name: 'member', component: () => import('../pages/Member.vue') },
  { path: '/laomo', name: 'laomo', component: () => import('../pages/Laomo.vue') },
  { path: '/yiliao', name: 'yiliao', component: () => import('../pages/Yiliao.vue') },
  // 更多 下拉真实页面
  { path: '/aid', name: 'aid', component: () => import('../pages/Aid.vue') },
  { path: '/refund', name: 'refund', component: () => import('../pages/Refund.vue') },
  // 表格演示（GridTable）
  { path: '/grid-table', name: 'grid-table', component: () => import('../pages/GridTablePage.vue') },
  { path: '/grid-table-2', name: 'grid-table-2', component: () => import('../pages/GridTablePage2.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
