<template>
  <div class="home-banner">
    <div class="banner-content">
      <h1 class="banner-title">Khám Phá Thế Giới Sách</h1>
      <p class="banner-description">Tìm kiếm những cuốn sách hay nhất để mở mang kiến thức và trí tưởng tượng của bạn!</p>
      <router-link to="/products" class="banner-btn">Khám Phá Ngay</router-link>
    </div>
    <div class="banner-slider" :style="bannerStyle"></div> <!-- Banner slider container -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Sử dụng import để lấy ảnh
import banner1 from '@/assets/banner1.png';
import banner2 from '@/assets/banner2.png';
import banner3 from '@/assets/banner3.png';

// Mảng chứa các banner
const banners = [banner1, banner2, banner3];

// Ref cho index ảnh hiện tại
const currentIndex = ref(0);
const bannerStyle = ref({});

const changeBanner = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length;
  bannerStyle.value = {
    backgroundImage: `url(${banners[currentIndex.value]})`
  };
};

// Set interval để thay đổi banner mỗi 5 giây
let bannerInterval;

onMounted(() => {
  // Đặt banner ban đầu
  bannerStyle.value = {
    backgroundImage: `url(${banners[currentIndex.value]})`
  };
  
  // Bắt đầu interval
  bannerInterval = setInterval(changeBanner, 5000);
});

// Dừng interval khi component bị hủy
onBeforeUnmount(() => {
  clearInterval(bannerInterval);
});
</script>

<style scoped>
.home-banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden; /* Chỉ hiển thị một banner tại một thời điểm */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.banner-content {
  max-width: 700px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
}

.banner-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  animation: fadeIn 1s ease-out;
}

.banner-description {
  font-size: 18px;
  margin-bottom: 20px;
  animation: fadeIn 1.5s ease-out;
}

.banner-btn {
  padding: 12px 24px;
  background-color: #0a7a3a;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border-radius: 30px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.banner-btn:hover {
  background-color: #08632e;
}

/* Slider style */
.banner-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out; /* Chuyển đổi ảnh mượt mà */
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
