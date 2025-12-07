<template>
  <div class="page-root">

    <!-- HEADER GREEN (TITLE + USER-MENU) -->
    <div class="page-header">
      <!-- LEFT TITLE -->
      <div class="title-wrapper">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Bảng điều khiển</span>
      </div>

      <!-- RIGHT USER-MENU (ngang hàng với tiêu đề, dropdown đầy đủ) -->
      <div class="auth-box">
        <div class="user-menu" @click="toggleDropdown" ref="userMenuBtn">
          <img class="avatar" :src="user?.avatar || defaultAvatar" />
          <span class="username">{{ user?.username || 'Khách' }}</span>
        </div>

        <!-- Dropdown (vẫn nằm trong vùng header green) -->
        <div v-if="showDropdown" class="dropdown" ref="dropdown">
          <div class="dropdown-top">
            <img class="avatar-large" :src="user?.avatar || defaultAvatar" />
            <div class="user-info">
              <b>{{ user?.username || 'Khách' }}</b>
              <p class="email">{{ user?.email || 'no-email@example.com' }}</p>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <button class="dropdown-item logout" @click.stop="logout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN WHITE BOX -->
    <div class="container">
      <div class="menu-grid">
        <div
          class="menu-card"
          v-for="item in menu"
          :key="item.name"
          @click="go(item.to)"
        >
          <i :class="['menu-icon', item.icon]"></i>
          <h3 class="menu-title">{{ item.label }}</h3>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import defaultAvatar from "@/assets/admin.png";

const router = useRouter();

const user = ref(null);
const showDropdown = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("user");
  if (stored) user.value = JSON.parse(stored);
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const toggleDropdown = (e) => {
  showDropdown.value = !showDropdown.value;
};

const handleOutsideClick = (e) => {
  // Nếu click ra ngoài dropdown và nút user, đóng dropdown
  const btn = document.querySelector(".user-menu");
  const dd = document.querySelector(".dropdown");
  if (!btn) return;
  if (btn.contains(e.target)) return; // click bên trong nút → handled elsewhere
  if (dd && dd.contains(e.target)) return; // click trong dropdown
  showDropdown.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

const go = (path) => {
  window.scrollTo(0, 0);
  router.push(path);
};

const menu = [
  { name: "books", label: "Quản lý sách", icon: "fa-solid fa-book", to: "/admin/products" },
  { name: "users", label: "Quản lý người dùng", icon: "fa-solid fa-users", to: "/admin/users" },
  { name: "tickets", label: "Phiếu mượn", icon: "fa-solid fa-file-lines", to: "/admin/loans" },
];
</script>

<style scoped>
.page-root {
  background: #f4f8fb;
  min-height: 100vh;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* ==== HEADER GIỐNG HỆT BORROW ==== */
.page-header {
  width: 96%;
  color: white;
  padding: 20px 28px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  z-index: 5;
  isolation: isolate;
}

.container {
  width: 85%;
  max-width: 900px;
  background: #ffffff !important;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);

  margin: 0 auto;
  margin-top: 20px;

  isolation: isolate;
  z-index: 2;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 23px;
  font-weight: 700;
}

.title-wrapper i {
  font-size: 26px;
}

.auth-box {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: 0.18s ease;
}
.user-menu:hover {
  background: rgba(255,255,255,0.06);
  transform: translateY(-2px);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.12);
}

.username {
  font-weight: 600;
  color: #fff;
}

/* DROPDOWN (giữ trong vùng header, hiển thị email) */
.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 240px;
  background: #ffffff;
  color: #222;
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 10px 28px rgba(0,0,0,0.22);
  z-index: 999;
}

.dropdown-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}

.avatar-large {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.user-info b {
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
}

.email {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

/* Dropdown buttons */
.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;
  transition: background 0.15s, transform 0.12s;
}
.dropdown-item i { width: 18px; text-align: center; }

.dropdown-item:hover {
  background: #f7faf8;
  transform: translateY(-2px);
}
.dropdown-item.logout {
  color: #d9534f;
}

/* MENU GRID */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.menu-card {
  width: 70%;
  margin: auto;
  padding: 55px 18px;
  border-radius: 18px;
  background: #28a745;  /* Sử dụng màu xanh lá sáng hơn */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 10px 26px rgba(0,0,0,0.15); 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.28s ease;
}

.menu-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0,0,0,0.25),
              0 0 22px rgba(0, 190, 140, 0.5);
  background: rgba(255,255,255,0.35);
}

.menu-icon {
  font-size: 34px;
  color: #fff;
  opacity: 0.9;
  transition: 0.25s ease;
}

.menu-card:hover .menu-icon {
  transform: rotate(12deg) scale(1.1);
  text-shadow: 0 0 12px rgba(0, 190, 140, 0.6);
}

.menu-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .menu-grid { grid-template-columns: 1fr; }
  .menu-card { width: 92%; }
}
</style>
