<template>
  <div class="page">
    <AppHeader />

    <!-- Banner (Slider) -->
    <HomeBanner />

    <section class="content">
      <!-- Sách nổi bật -->
      <div class="section-title-wrapper">
        <h2 class="section-title blink-text">SÁCH NỔI BẬT</h2>
      </div>

      <div class="slider-wrapper"
        @mouseenter="hotHover = true"
        @mouseleave="hotHover = false"
      >
        <button
          v-if="products.length > itemsPerSlide"
          class="nav-btn left"
          :class="{ show: hotHover }"
          @click="prevHot"
        >
          &#8249;
        </button>

        <div class="slider" ref="hotSlider">
          <div class="book-card" v-for="b in products" :key="b._id" @click="goDetail(b._id)">
            <img class="img" :src="getImage(b.image)" />
            <h3 class="book-title">{{ b.title }}</h3>
            <!-- Nếu chưa đăng nhập thì ẩn nút mượn sách -->
            <button class="btn" @click.stop="openloan(b)" v-if="isLoggedIn">Mượn ngay</button>
            <p v-else class="btn disabled">Đăng nhập để mượn sách</p>
          </div>
        </div>

        <button
          v-if="products.length > itemsPerSlide"
          class="nav-btn right"
          :class="{ show: hotHover }"
          @click="nextHot"
        >
          &#8250;
        </button>
      </div>

      <!-- Sách mới -->
      <div class="section-title-wrapper new-wrapper">
        <span class="ribbon-new">NEW</span>
        <h2 class="section-title">SẢN PHẨM MỚI</h2>
      </div>

      <div class="slider-wrapper"
        @mouseenter="newHover = true"
        @mouseleave="newHover = false"
      >
        <button
          v-if="newBooks.length > itemsPerSlide"
          class="nav-btn left"
          :class="{ show: newHover }"
          @click="prevNew"
        >
          &#8249;
        </button>

        <div class="slider" ref="newSlider">
          <div class="book-card" v-for="b in newBooks" :key="b._id">
            <img class="img" :src="getImage(b.image)" />
            <h3 class="book-title">{{ b.title }}</h3>
            <!-- Nếu chưa đăng nhập thì ẩn nút mượn sách -->
            <button class="btn" @click.stop="openloan(b)" v-if="isLoggedIn">Mượn ngay</button>
            <p v-else class="btn disabled">Đăng nhập để mượn sách</p>
          </div>
        </div>

        <button
          v-if="newBooks.length > itemsPerSlide"
          class="nav-btn right"
          :class="{ show: newHover }"
          @click="nextNew"
        >
          &#8250;
        </button>
      </div>

    </section>

    <AppFooter />

    <!-- POPUP MƯỢN SÁCH -->
    <div v-if="showloanPopup" class="popup-overlay">
      <div class="popup-box detail-popup">
        <h3 class="popup-title">Mượn sách</h3>
        <p class="book-name">{{ selectedBook?.title }}</p>
        <button class="send-btn" @click="sendloan">
          Gửi yêu cầu
        </button>
        <button class="close-btn" @click="showloanPopup = false">
          Đóng
        </button>
      </div>
    </div>

    <!-- Notify -->
    <div v-if="notify.show" :class="['notify-box', notify.type]">
      {{ notify.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import HomeBanner from "@/components/HomeBanner.vue"; 
import productService from "@/services/product.service.js";
import loanService from "@/services/loan.service.js";
import authService from "@/services/auth.service.js";  // import auth service để kiểm tra đăng nhập
import "../../assets/main.css";

const router = useRouter();
const products = ref([]);
const newBooks = ref([]);
const hotIndex = ref(0);
const newIndex = ref(0);
const itemsPerSlide = 4;

const hotHover = ref(false);
const newHover = ref(false);

const hotSlider = ref(null);
const newSlider = ref(null);

const showloanPopup = ref(false);
const selectedBook = ref(null);

// Slide function
const slide = (sliderRef, index) => {
  if (!sliderRef.value) return;
  sliderRef.value.style.transform = `translateX(-${index.value * 100}%)`;
};

// NEXT / PREV nổi bật
const nextHot = () => {
  const max = Math.ceil(products.value.length / itemsPerSlide) - 1;
  if (hotIndex.value < max) hotIndex.value++;
  slide(hotSlider, hotIndex);
};
const prevHot = () => {
  if (hotIndex.value > 0) hotIndex.value--;
  slide(hotSlider, hotIndex);
};

// NEXT / PREV mới
const nextNew = () => {
  const max = Math.ceil(newBooks.value.length / itemsPerSlide) - 1;
  if (newIndex.value < max) newIndex.value++;
  slide(newSlider, newIndex);
};
const prevNew = () => {
  if (newIndex.value > 0) newIndex.value--;
  slide(newSlider, newIndex);
};

// Load data
onMounted(async () => {
  const data = await productService.getAll();
  // Sách nổi bật
  const sortedBooks = [...data].sort((a, b) => b.quantity - a.quantity);

  // Lấy 15 cuốn sách có số lượt mượn nhiều nhất
  const topBooks = sortedBooks.slice(0, 15);

  // Lưu vào state
  products.value = topBooks;
  // Sách mới
  newBooks.value = [...data].sort((a, b) => (b._id > a._id ? 1 : -1));
});

// Tạo URL ảnh
const getImage = (path) => {
  if (!path) return "";
  return `http://localhost:3000${path}`;
};

const openloan = (book) => {
  selectedBook.value = book;
  showloanPopup.value = true;
};

// Notify function
const notify = ref({
  show: false,
  message: "",
  type: "",
});

const showNotify = (msg, type = "success-add") => {
  notify.value = { show: true, message: msg, type };
  setTimeout(() => (notify.value.show = false), 1600);
};

const sendloan = async () => {
  try {
    await loanService.requestloan(selectedBook.value._id);
    showNotify("Gửi yêu cầu mượn thành công!", "success-add");
    showloanPopup.value = false;
  } catch {
    showNotify("Yêu cầu mượn thất bại! Hết sách", "error");
  }
};

// Kiểm tra người dùng đã đăng nhập chưa
const isLoggedIn = ref(authService.isLoggedIn());  // Kiểm tra từ dịch vụ auth

const goDetail = (id) => {
  window.scrollTo(0, 0);
  router.push(`/product/${id}`);
};
</script>

<style scoped>
/* Toàn trang */
.page {
  padding: 0 !important;
  margin: 0 !important;
}

/* SLIDER OUTER */
.slider-wrapper {
  position: relative;
  overflow: hidden;
  width: 92%;
  margin: 20px auto;
}

/* SLIDER INNER */
.slider {
  display: flex;
  transition: transform 0.4s ease;
}

/* Mỗi card chiếm 1/5 màn hình */
.slider .book-card {
  flex: 0 0 calc(20% - 12px);
  margin: 0 6px;
  background: white;
  border-radius: 14px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  transition: .25s ease;
  min-height: 310px;
}

/* Card đồng bộ kích thước */
.book-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 330px;
}

/* Tiêu đề không bị tràn gây lệch */
.book-title {
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.nav-btn {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.38);
  color: white;
  border: none;

  width: 42px;
  height: 42px;

  font-size: 22px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;

  opacity: 0;
  visibility: hidden;
  transition: opacity .25s ease;
}

.nav-btn.left { left: 5px; }
.nav-btn.right { right: 5px; }

/* Chỉ hiện khi hover */
.nav-btn.show {
  opacity: 1;
  visibility: visible;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.55);
}

/* KHUNG TIÊU ĐỀ */
/* Căn giữa toàn bộ nội dung section */
.content {
  width: 96%;
  margin: 0 auto;
}

.section-title-wrapper {
  width: 100%;
  background: #2b7852;
  padding: 14px 0;
  margin-top: 40px;
  border-radius: 18px;
  position: relative;
}

.section-title-wrapper:first-of-type {
  background: #2b7852;
  box-shadow: 0 0 10px rgba(0,255,150,0.7);
  border: 2px solid #ffffff55;
}

.section-title {
  text-align: center;
  font-size: 26px;
  font-weight: 900;
  color: white;
  margin: 0;
}

/* Blink */
.blink-text {
  animation: blink 1.4s infinite ease-in-out;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

/* CARD */
.book-card {
  background: white;
  border-radius: 14px;
  padding: 14px;
  text-align: center;

  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  transition: .25s ease;

  margin: 0 6px;
  min-height: 310px;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}

.img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.book-title {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #094d30;
  line-height: 1.2;
}

.btn {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 10px;

  background: #0a7a3a;
  color: white;
  font-weight: 600;
  font-size: 14px;

  transition: .2s ease;
}

.btn:hover {
  background: #08632e;
  transform: translateY(-2px);
}

/* Ribbon NEW */
.new-wrapper {
  position: relative;
}

.ribbon-new {
  position: absolute;
  bottom: 25px;
  left: 10px;
  display: block;
  width: 110px;
  text-align: center;
  background: #ff2d2d;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  transform: rotate(-38deg);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  z-index: 10;
}

.ribbon-new::before,
.ribbon-new::after {
  content: "";
  position: absolute;
  bottom: -6px;
  border-style: solid;
}

.ribbon-new::before {
  left: 6px;
  border-width: 6px 6px 0 0;
  border-color: #b71c1c transparent transparent transparent;
}

.ribbon-new::after {
  right: 6px;
  border-width: 6px 0 0 6px;
  border-color: #b71c1c transparent transparent transparent;
}

/* POPUP */
/* Lớp nền mờ phủ toàn màn hình */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.detail-popup {
  background: #ffffff;
  padding: 30px;
  width: 360px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 26px rgba(0,0,0,0.20);
}

.popup-title {
  font-size: 22px;
  font-weight: 800;
  color: #0e4a32;
  margin-bottom: 10px;
}

.book-name {
  font-size: 18px;
  font-weight: 700;
  color: #063d24;
  margin-bottom: 24px;
}

.send-btn {
  background: #0a7a3a;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  font-weight: 700;
}

.close-btn {
  margin-top: 12px;
  padding: 10px;
  width: 100%;
  background: #ddd;
  border-radius: 10px;
}

</style>
