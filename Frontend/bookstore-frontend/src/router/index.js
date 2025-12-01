import { createRouter, createWebHistory } from "vue-router";

// USER PAGES
import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import Home from "@/views/user/Home.vue";
import BorrowHistoryPage from "@/views/user/BorrowHistoryPage.vue";
import Products from "@/views/user/Products.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";   // ⬅ THÊM

// ADMIN PAGES
import Dashboard from "@/views/admin/Dashboard.vue";
import AdminBorrowPage from "@/views/admin/AdminBorrowPage.vue";
import ProductsPage from "@/views/admin/ProductsPage.vue";

const routes = [
  //---------------------------
  // USER AUTH ROUTES
  //---------------------------
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },

  //---------------------------
  // USER HOME
  //---------------------------
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },

  //---------------------------
  // USER BORROW HISTORY
  //---------------------------
  {
    path: "/borrow-history",
    name: "BorrowHistory",
    component: BorrowHistoryPage,
    meta: { requiresAuth: true },
  },

  //---------------------------
  // USER PRODUCT LIST
  //---------------------------
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { requiresAuth: true },
  },

  //---------------------------
  // USER PRODUCT DETAIL (THÊM)
  //---------------------------
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
    meta: { requiresAuth: true },
  },

  //---------------------------
  // ADMIN PAGES
  //---------------------------
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },

  {
    path: "/admin/borrows",
    name: "AdminBorrowPage",
    component: AdminBorrowPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },

  {
    path: "/admin/products",
    name: "AdminProducts",
    component: ProductsPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// -------------------------------
//  GLOBAL NAVIGATION GUARD
// -------------------------------
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Route yêu cầu đăng nhập nhưng chưa login
  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  // Route yêu cầu khách nhưng lại đã login
  if (to.meta.requiresGuest && user) {
    return next("/");
  }

  // Yêu cầu admin
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return next("/");
  }

  next();
});

export default router;
