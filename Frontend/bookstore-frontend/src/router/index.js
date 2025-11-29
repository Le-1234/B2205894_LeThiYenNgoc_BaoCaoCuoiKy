import { createRouter, createWebHistory } from "vue-router";

// Import các trang
import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import Home from "@/views/user/Home.vue";
import Dashboard from "@/views/admin/Dashboard.vue"; // <--- thêm
import ProductsPage from "../views/admin/ProductsPage.vue";
import ProductAdd from "../views/admin/ProductAdd.vue";
import ProductEdit from "../views/admin/ProductEdit.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

    {
      path: "/",
      name: "Home",
      component: Home,
      meta: { requiresAuth: true },
    },

    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiresAdmin: true, // <--- chỉ admin vào được
      },
    },

     {
      path: "/admin/products",
      name: "products",
      component: ProductsPage,
      meta: { requiresAdmin: true }
    },

    {
      path: "/admin/products/add",
      name: "product-add",
      component: ProductAdd,
      meta: { requiresAdmin: true }
    },

    {
      path: "/admin/products/edit/:id",
      name: "product-edit",
      component: ProductEdit,
      props: true,
      meta: { requiresAdmin: true }
    },
    // Trang không tồn tại
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// -------------------------------
//  GUARD kiểm tra đăng nhập
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

  // Route yêu cầu admin nhưng user không phải admin
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return next("/"); // hoặc redirect ra trang 403
  }

  next();
});

export default router;
