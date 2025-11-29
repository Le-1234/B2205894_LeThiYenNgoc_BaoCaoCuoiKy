<template>
  <section class="banner">
    <div class="overlay">
      <h2 class="title">Hệ thống mượn sách trực tuyến</h2>
      <p class="subtitle">Nhanh chóng – Tiện lợi – Hiện đại</p>
    </div>
  </section>
</template>

<style scoped>
.banner {
  width: 100%;
  height: 330px;
  background: url('@/assets/banner.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  width: 100%;
  height: 100%;
  background: rgba(14, 74, 50, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  font-size: 42px;
  font-weight: 800;
  color: #eafff0;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  margin-top: 10px;
  color: #d8ffe8;
}
</style>
