import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("../pages/Dashboard.vue"),
  },
  { path: "/home", name: "home", component: () => import("../pages/Home.vue") },
  {
    path: "/org-old",
    name: "org-old",
    component: () => import("../pages/Org.vue"),
  },
  {
    path: "/org",
    name: "org",
    component: () => import("../pages/OrgV2.vue"),
  },
  {
    path: "/member-old",
    name: "member-old",
    component: () => import("../pages/Member.vue"),
  },
  {
    path: "/member",
    name: "member",
    component: () => import("../pages/MemberV2.vue"),
  },
  {
    path: "/laomo",
    name: "laomo",
    component: () => import("../pages/Laomo.vue"),
  },
  {
    path: "/yiliao",
    name: "yiliao",
    component: () => import("../pages/Yiliao.vue"),
  },
  // 更多 下拉真实页面
  { path: "/aid", name: "aid", component: () => import("../pages/Aid.vue") },
  { path: "/aid-v2", name: "aid-v2", component: () => import("../pages/AidV2.vue") },
  {
    path: "/refund",
    name: "refund",
    component: () => import("../pages/Refund.vue"),
  },
  // 下属工会详情列表（退款资金明细列表）
  {
    path: "/refund-detail-list",
    name: "refund-detail-list",
    component: () => import("../pages/RefundDetailListPage.vue"),
  },
  // 表格演示（GridTable）
  {
    path: "/grid-table",
    name: "grid-table",
    component: () => import("../pages/GridTablePage.vue"),
  },
  {
    path: "/grid-table-2",
    name: "grid-table-2",
    component: () => import("../pages/GridTablePage2.vue"),
  },
  {
    path: "/laomo-list",
    name: "laomo-list",
    component: () => import("../pages/LaomoList.vue"),
  },
  {
    path: "/aid-list",
    name: "aid-list",
    component: () => import("../pages/AidListPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
