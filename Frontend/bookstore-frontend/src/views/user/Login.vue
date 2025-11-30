<template>
  <div class="page-root">

    <div class="login-container">

      <!-- LEFT -->
      <div class="left-side">
        <h1 class="brand-title">WELCOME BACK</h1>
        <p class="brand-text">Đăng nhập để tiếp tục</p>
      </div>

      <!-- RIGHT -->
      <div class="right-side">
        <div class="form-box glass">

          <h2 class="form-title">Đăng nhập</h2>

          <form @submit.prevent="handleLogin">

            <div class="field">
              <input type="email" v-model="email" placeholder="Email" required />
            </div>

            <div class="field">
              <input type="password" v-model="password" placeholder="Mật khẩu" required />
            </div>

            <button class="btn" type="submit">Đăng nhập</button>
          </form>

          <p class="foot">
            Chưa có tài khoản?
            <router-link class="link" to="/register">Đăng ký ngay</router-link>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/auth.service";
import "../../assets/main.css";

const email = ref("");
const password = ref("");

const router = useRouter();

const handleLogin = async () => {
  const res = await authService.login({
    email: email.value,
    password: password.value
  });

  if (res?.success && res.token) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    if (res.user.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  } else {
    alert(res?.message || "Đăng nhập thất bại!");
  }
};
</script>