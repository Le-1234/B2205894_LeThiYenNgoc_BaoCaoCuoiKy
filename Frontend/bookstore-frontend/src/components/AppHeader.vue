<template>
  <header class="header">

    <div class="logo">MyBook</div>

    <nav>
      <router-link to="/">Trang chủ</router-link>
      <router-link to="/products">Sách</router-link>
    </nav>

    
<div class="auth-box">

  <!-- Nếu chưa login -->
  <router-link v-if="!user" class="login-btn" to="/login">
    Đăng nhập
  </router-link>

  <!-- Nếu đã login -->
  <template v-else>
    
    <!-- 👉 ICON LỊCH SỬ MƯỢN -->
    <router-link to="/borrow-history" class="history-icon">
      <i class="fa-solid fa-book-open"></i>
    </router-link>

    <!-- Menu user -->
    <div class="user-menu" @click="toggleDropdown">
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

  </template>

</div>

  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import "../assets/main.css";

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
</script>

<style scoped>
.header {
  width: 100%;
  padding: 14px 30px;
  background: #0e4a32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Montserrat', sans-serif !important;

  /* Thêm 3 dòng này */
  position: sticky;
  top: 0;
  z-index: 999;
}


.logo {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif !important;
}


</style>