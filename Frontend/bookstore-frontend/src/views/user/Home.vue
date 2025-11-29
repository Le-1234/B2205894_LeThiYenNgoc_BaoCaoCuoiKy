<template>
  <div class="page">
    <AppHeader />

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
          <div class="book-card" v-for="b in products" :key="b._id">
            <img class="img" :src="getImage(b.image)" />
            <h3 class="book-title">{{ b.title }}</h3>
            <button class="btn">Mượn ngay</button>
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
        <h2 class="section-title">Mới thêm gần đây</h2>
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
            <button class="btn">Mượn ngay</button>
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
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import HomeBanner from "@/components/HomeBanner.vue";
import productService from "@/services/product.service.js";

const products = ref([]);
const newBooks = ref([]);

// Slider index
const hotIndex = ref(0);
const newIndex = ref(0);
const itemsPerSlide = 4;

// Hover state
const hotHover = ref(false);
const newHover = ref(false);

const hotSlider = ref(null);
const newSlider = ref(null);

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
  const map = new Map();
  data.forEach(book => {
    if (!map.has(book.category)) map.set(book.category, book);
  });
  products.value = Array.from(map.values());

  // Sách mới
  newBooks.value = [...data].sort((a, b) => (b._id > a._id ? 1 : -1));
});

// Tạo URL ảnh
const getImage = (path) => {
  if (!path) return "";
  return `http://localhost:3000${path}`;
};
</script>




<style scoped>
/* Toàn trang */
.page {
  background: #f4f9f5;
}

/* SLIDER OUTER */
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
  min-width: calc(100% / 4);
}

/* Nút trái/phải – dạng tròn mờ */
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
.section-title-wrapper {
  width: 100%;
  background: linear-gradient(130deg, #1fff8b, #0b5831);
  padding: 14px 0;
  margin-top: 40px;
  border-radius: 18px;
  position: relative;
}

.section-title-wrapper:first-of-type {
  background: linear-gradient(145deg, #07ff88, #006a3d);
  box-shadow: 0 0 18px rgba(0,255,150,0.7);
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
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transition: .3s;
}

.book-card:hover {
  transform: translateY(-6px);
}

.img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 12px;
}

.book-title {
  margin: 12px 0;
  font-size: 18px;
  font-weight: 700;
  color: #0d5c38;
}

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(120deg, #1fff8b, #0b5831);
  color: white;
  font-weight: 700;
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
</style>
