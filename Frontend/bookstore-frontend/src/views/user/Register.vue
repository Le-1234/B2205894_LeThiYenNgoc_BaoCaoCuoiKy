<template>
  <div class="page-root">
    <div class="login-container">

      <div class="left-side">
        <h1 class="brand-title">CREATE ACCOUNT</h1>
        <p class="brand-text">Tham gia ngay để bắt đầu</p>
      </div>

      <div class="right-side">
        <div class="form-box">
          <h2 class="form-title">Đăng ký</h2>

          <form @submit.prevent="handleRegister">
            <div class="field">
              <input type="text" v-model="username" placeholder="Tên đăng nhập" required />
            </div>

            <div class="field">
              <input type="email" v-model="email" placeholder="Email" required />
            </div>

            <div class="field">
              <input type="password" v-model="password" placeholder="Mật khẩu" required />
            </div>

            <div class="field">
              <input type="password" v-model="confirmPassword" placeholder="Nhập lại mật khẩu" required />
            </div>

            <button class="btn" type="submit">Đăng ký</button>
          </form>

          <p class="foot">
            Đã có tài khoản?
            <router-link class="link" to="/login">Đăng nhập ngay</router-link>
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

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    return alert("Mật khẩu không khớp!");
  }

  const res = await authService.register({
    username: username.value,
    email: email.value,
    password: password.value
  });

  if (res?.success) {
    alert("Đăng ký thành công!");
    router.push("/login");
  } else {
    alert(res?.message || "Đăng ký thất bại!");
  }
};

</script>
