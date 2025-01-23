import { createRouter, createWebHistory } from "vue-router";
import LookEditView from '@/views/LookEditView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/marketing",
      name: "marketing",
      component: () => import("../views/MarketingView.vue"),
    },
    {
      path: "/wardrobe",
      name: "wardrobe",
      component: () => import("../views/WardrobeView.vue"),
    },
    {
      path: "/wardrobe/:slug",
      name: "wardrobe-category",
      component: () => import("../views/WardrobeCategoryView.vue"),
    },
    {
      path: "/looks",
      name: "looks",
      component: () => import("../views/LooksView.vue"),
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../views/CalendarView.vue"),
    },
    {
      path: "/references",
      name: "references",
      component: () => import("../views/ReferencesView.vue"),
    },
    {
      path: "/wardrobe/item/:id?",
      name: "wardrobe-item",
      component: () => import("../views/WardrobeItemView.vue"),
      props: true,
    },
    {
      path: '/looks/new',
      name: 'look-new',
      component: LookEditView
    },
    {
      path: '/looks/:id/edit',
      name: 'look-edit',
      component: LookEditView
    }
  ],
});

export default router;
