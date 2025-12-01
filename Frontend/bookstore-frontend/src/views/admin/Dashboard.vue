<template>
  <div class="dashboard-wrapper">

    <!-- HEADER -->
    <header class="top-header">
      <h1 class="dashboard-title">📘 Trang Quản Trị</h1>

      <div class="auth-box">
        <router-link v-if="!user" class="login-btn" to="/login">
          Đăng nhập
        </router-link>

        <div v-else class="user-menu" @click="toggleDropdown">
          <i class="fa-solid fa-user user-icon"></i>
          <span class="username">{{ user.username }}</span>

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

    <!-- FEATURE CARDS -->
    <div class="features">
      <div class="feature-card" @click="goTo('/admin/products')">
        <i class="fa-solid fa-book card-icon"></i>
        <h3>Quản lý sách</h3>
      </div>

      <div class="feature-card" @click="goTo('/admin/users')">
        <i class="fa-solid fa-users card-icon"></i>
        <h3>Người dùng</h3>
      </div>

      <div class="feature-card" @click="goTo('/admin/borrows')">
        <i class="fa-solid fa-file-lines card-icon"></i>
        <h3>Phiếu mượn</h3>
      </div>

      <div class="feature-card" @click="goTo('/admin/stats')">
        <i class="fa-solid fa-chart-line card-icon"></i>
        <h3>Thống kê</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);
const showDropdown = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("user");
  if (stored) user.value = JSON.parse(stored);
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(160deg, #daf6df, #f4faf5);
  padding: 40px 60px;
  font-family: "Montserrat", sans-serif !important;
}

/* HEADER */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.dashboard-title {
  font-size: 32px;
  color: #0e4a32;
  font-weight: 700;
}

/* FEATURE GRID */
.features {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px;
}

.feature-card {
  background: white;
  border-radius: 18px;
  padding: 32px 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  text-align: center;
  cursor: pointer;
  transition: 0.25s;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.18);
}

.card-icon {
  font-size: 48px;
  color: #0e4a32;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0e4a32;
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  right: 40px;
  top: 70px;
  background: #d5f5df;
  border-radius: 12px;
  min-width: 180px;
  padding: 12px 0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  z-index: 99;
}

.dropdown-item {
  padding: 10px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.dropdown-item.logout {
  color: #c0392b;
}
</style>
