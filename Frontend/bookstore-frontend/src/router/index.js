import { createRouter, createWebHistory } from "vue-router";

// USER PAGES
import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import Home from "@/views/user/Home.vue";
import loanHistoryPage from "@/views/user/LoanHistoryPage.vue";
import Products from "@/views/user/Products.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";   // ⬅ THÊM

// ADMIN PAGES
import Dashboard from "@/views/admin/Dashboard.vue";
import AdminloanPage from "@/views/admin/AdminloanPage.vue";
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
  // USER HOME (Không yêu cầu đăng nhập)
  //---------------------------
  {
    path: "/",
    name: "Home",
    component: Home,
    // Không có meta.requiresAuth ở đây, nghĩa là trang Home có thể truy cập mà không cần đăng nhập
  },

  //---------------------------
  // USER loan HISTORY
  //---------------------------
  {
    path: "/loan-history",
    name: "loanHistory",
    component: loanHistoryPage,
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
    path: "/admin/loans",
    name: "AdminloanPage",
    component: AdminloanPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },

  {
    path: "/admin/products",
    name: "AdminProducts",
    component: ProductsPage,
    meta: { requiresAuth: true, requiresAdmin: true },
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
    return next("/"); // Redirect về Home
  }

  // Yêu cầu admin nhưng user không phải là admin
  if (to.meta.requiresAdmin && (!user || user.role !== "admin")) {
    return next("/"); // Redirect về Home nếu không phải admin
  }

  next();
});

export default router;
