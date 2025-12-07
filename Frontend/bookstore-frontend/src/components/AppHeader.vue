<template>
  <header class="header">

    <!-- LOGO -->
    <div class="logo">MyBook</div>

    <!-- MENU -->
    <nav class="menu">
      <router-link to="/products">Sách</router-link>
      <router-link to="/loan-history">Lịch sử mượn</router-link>
    </nav>

    <!-- SEARCH BOX (tách component) -->
    <SearchBox class="search-area" @go-detail="goDetail" />

    <!-- USER -->
    <div class="auth-box">
      <!-- Hiển thị nút đăng nhập và đăng ký khi chưa đăng nhập -->
      <router-link v-if="!user" class="login-btn" to="/login">
        Đăng nhập
      </router-link>
      <router-link v-if="!user" class="auth-btn register-btn" to="/register">
        Đăng ký
      </router-link>

      <template v-else>
        <div class="user-menu" @click="toggleDropdown">
          <img class="avatar" :src="user.avatar || defaultAvatar" />
          <span class="username">{{ user.username }}</span>

          <div v-if="showDropdown" class="dropdown">
            <div class="dropdown-top">
              <img class="avatar-large" :src="user.avatar || defaultAvatar" />
              <div>
                <b>{{ user.username }}</b>
                <p>{{ user.email }}</p>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <button class="dropdown-item logout" @click.stop="logout">
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
import SearchBox from "@/components/SearchBox.vue";
import defaultAvatar from "../assets/avatar.png";

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

const goDetail = (id) => {
  window.scrollTo(0, 0);
  router.push(`/product/${id}`);
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
  gap: 40px;
  position: sticky;
  top: 0;
  z-index: 999;
  font-family: 'Montserrat', sans-serif !important;
}

.logo {
  font-size: 24px;
  font-weight: 700;
}

.menu {
  display: flex;
  gap: 25px;
}

.menu a {
  color: #ffffffcc;
  font-weight: 600;
  text-decoration: none;
}

.menu a:hover {
  color: white;
}

/* 🔥 SearchBox đứng ở giữa header đẹp hơn */
.search-area {
  margin-left: auto;
  margin-right: auto;
}

/* USER box sát phải */
.auth-box {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.login-btn {
  color: white;
  background: #1cb56d;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 700;
}

.user-menu {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 600;
}

.dropdown {
  position: absolute;
  background: white;
  color: black;
  top: 46px;
  right: 0;
  width: 230px;
  border-radius: 12px;
  padding: 12px 0;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  animation: fadeIn 0.2s ease;
}

.dropdown-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.dropdown-divider {
  height: 1px;
  background: #ddd;
  margin: 6px 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item.logout {
  color: #d32f2f;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

/* Nút Đăng ký */
.register-btn {
  color: white;
  background: #1cb56d;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 700;
  margin-left: 10px;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s ease; 
}

.register-btn:hover {
  background: #17a253;
}

</style>
