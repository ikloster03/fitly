import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
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
  ],
});

export default router;
