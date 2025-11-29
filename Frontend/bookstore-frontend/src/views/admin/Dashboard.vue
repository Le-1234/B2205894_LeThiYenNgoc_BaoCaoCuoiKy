<template>
  <div class="admin-page">

    <!-- SIDEBAR -->
    <aside :class="['sidebar', { collapsed: isCollapsed }]">

      <div class="top-side">
        <h2 class="side-title" v-show="!isCollapsed">Admin</h2>

        <button class="toggle-btn" @click="toggleSidebar">
          <i class="fa-solid" :class="isCollapsed ? 'fa-bars' : 'fa-angles-left'"></i>
        </button>
      </div>

      <nav class="side-menu">
        <button
          v-for="item in menu"
          :key="item.name"
          :class="['menu-item', { active: activeMenu === item.name }]"
          @click="setActive(item.name)"
        >
          <i :class="item.icon"></i>

          <span class="menu-text" v-show="!isCollapsed">{{ item.label }}</span>

          <!-- Tooltip khi thu gọn -->
          <div class="tooltip" v-if="isCollapsed">{{ item.label }}</div>
        </button>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main :class="['main-content', { collapsed: isCollapsed }]">

      <header class="top-header">
        <h1 class="dashboard-title">📘 Dashboard</h1>

        <div class="auth-box">
          <!-- Nếu chưa login -->
          <router-link v-if="!user" class="login-btn" to="/login">
            Đăng nhập
          </router-link>

          <!-- Nếu đã login -->
          <div v-else class="user-menu" @click="toggleDropdown">
            <i class="fa-solid fa-user user-icon"></i>
            <span class="username">{{ user.username }}</span>

            <!-- DROPDOWN -->
            <div v-if="showDropdown" class="dropdown">
              <div class="dropdown-item info">
                <i class="fa-solid fa-user"></i>
                <span>{{ user.username }}</span>
              </div>

              <div class="dropdown-item info">
                <i class="fa-solid fa-envelope"></i>
                <span>{{ user.email }}</span>
              </div>

              <div class="dropdown-divider"></div>

              <button class="dropdown-item logout" @click="logout">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import "../../assets/main.css";

const router = useRouter();
const user = ref(null);
const showDropdown = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("user");
  if (stored) user.value = JSON.parse(stored);
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

const isCollapsed = ref(false);
const activeMenu = ref("books");

const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value);
const setActive = (name) => (activeMenu.value = name);

const menu = [
  { name: "books", label: "Quản lý sách", icon: "fa-solid fa-book" },
  { name: "users", label: "Người dùng", icon: "fa-solid fa-users" },
  { name: "tickets", label: "Phiếu mượn", icon: "fa-solid fa-file-lines" },
  { name: "stats", label: "Thống kê", icon: "fa-solid fa-chart-line" }
];
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(160deg, #daf6df, #f4faf5);
  font-family: 'Montserrat', sans-serif !important;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background: #0e4a32;
  color: white;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 18px rgba(0, 0, 0, 0.25);

  transition: width 0.35s ease;
  overflow: visible;
}

.sidebar.collapsed {
  width: 80px;
}

/* Header sidebar */
.top-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.side-title {
  font-weight: 700;
  font-size: 22px;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* ============================== */
/*           MENU ITEM            */
/* ============================== */
.side-menu {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  position: relative;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.15);
  color: white;

  display: flex;
  align-items: center;
  gap: 14px;

  text-align: left;
  cursor: pointer;

  transition: 0.25s;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
}

/* Hover */
.menu-item:hover {
  background: rgba(255, 255, 255, 0.30);
}

/* ACTIVE */
.menu-item.active {
  background: #ffffff33;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.28);

  border-left: 10px solid #4affb9;
  padding-left: 14px; 
  font-weight: 700;
}

.menu-item.active i {
  color: #4affb9;
}

/* Tooltip */
.tooltip {
  position: absolute;
  left: 85px;
  background: #0e4a32;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-50%);
  pointer-events: none;
  transition: 0.2s;
  top: 50%;
}

.sidebar.collapsed .menu-item:hover .tooltip {
  opacity: 1;
  left: 100px;
}

/* ============================== */
/*        MAIN CONTENT            */
/* ============================== */
.main-content {
  flex: 1;
  padding: 30px 40px;
  transition: 0.3s ease;
}

/* Dashboard Title – giống header */
.dashboard-title {
  font-size: 28px;
  color: #0e4a32;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif !important;
}

/* Admin info */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0e4a32;
  font-weight: 600;
}

.dropdown {
  position: absolute;
  right: 50px;
  top: 75px; 
  background: #d5f5df;
  border-radius: 10px;
  min-width: 180px;
  padding: 10px 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  z-index: 99;
  font-family: 'Montserrat', sans-serif !important;
}


</style>
