<template>
  <div class="page">

    <!-- HEADER -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/products')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-book-open"></i>
        <span>Chi tiết sách</span>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="detail-wrapper">

      <!-- LEFT: IMAGE -->
      <div class="gallery">
        <img :src="selectedImage" class="main-image" />

        <div class="thumbs">
          <img 
            v-for="(img,i) in allImages"
            :key="i"
            :src="img"
            class="thumb"
            :class="{ active: img === selectedImage }"
            @click="selectedImage = img"
          />
        </div>
      </div>

      <!-- RIGHT -->
      <div class="info">
        <h2 class="book-title">{{ product.title }}</h2>

        <p class="author">Tác giả: {{ product.author }}</p>
        <p class="category">Thể loại: {{ categoryName }}</p>
        <p class="publisher">Nhà xuất bản: {{ product.publisher }}</p>
        <p class="cover">Loại bìa: {{ product.coverType }}</p>
        <p class="year">Năm xuất bản: {{ product.year }}</p>
        <p>Mô tả:</p>
        <p class="desc">{{ product.description }}</p>

        <p class="qty">
          Còn lại: 
          <strong>{{ product.quantity }}</strong> / {{ product.totalQuantity }}
        </p>

        <button class="loan-btn" @click="loanBook">
          Mượn ngay
        </button>
      </div>
    </div>

    <!-- POPUP -->
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

    <!-- RELATED BOOKS -->
    <div class="related-box">
      <h3 class="related-title">Sách liên quan</h3>

      <div class="slider-container">
        
        <!-- nút trái -->
        <button class="slide-btn left" @click="prevSlide">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- slider -->
        <div class="slider" ref="sliderRef">
          <div
            v-for="p in related"
            :key="p._id"
            class="related-item"
            @click="goDetail(p._id)"
          >
            <img :src="p.image" />
            <p class="r-title">{{ p.title }}</p>
          </div>
        </div>

        <!-- nút phải -->
        <button class="slide-btn right" @click="nextSlide">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import productService from "@/services/product.service.js";
import loanService from "@/services/loan.service.js";

const route = useRoute();
const router = useRouter();

// MAIN DATA
const product = ref({});
const categoryName = ref("");

// IMAGES
const allImages = ref([]);
const selectedImage = ref("");

// RELATED
const related = ref([]);
const sliderRef = ref(null);
const slideIndex = ref(0);
const itemsPerSlide = 5;
const itemWidth = 20;
const gap = 18; 
/* == FIX LOAD IMAGE == */
const getImage = (path) => {
  if (!path) return "";
  return `http://localhost:3000${path}`;
};;

/* LOAD DATA */
onMounted(async () => {
  try {
    const res = await productService.getById(route.params.id);
    product.value = res;

    // ====== IMAGES FIXED ======
    allImages.value = [
      getImage(res.image),
      getImage(res.detail1),
      getImage(res.detail2)
    ].filter(Boolean);

    selectedImage.value = allImages.value[0];

    // category
    const cRes = await fetch("http://localhost:3000/api/categories");
    const categories = await cRes.json();
    categoryName.value =
      categories.find((c) => c._id === res.categoryId)?.name || "Không rõ";

    // related (10 sp) — FIX IMAGE
    const all = await productService.getAll();
    related.value = all
      .filter((p) => p.categoryId === res.categoryId && p._id !== res._id)
      .slice(0, 10)
      .map((p) => ({
        ...p,
        image: getImage(p.image)
      }));

  } catch (err) {
    console.error(err);
  }
});

// --- SLIDER LIKE HOMEPAGE ---

const slide = () => {
  if (!sliderRef.value) return;

  const movePercent = slideIndex.value * (itemsPerSlide * (itemWidth + (gap / 3))); 

  sliderRef.value.style.transform = `translateX(-${movePercent}%)`;
};

const nextSlide = () => {
  const max = Math.ceil(related.value.length / itemsPerSlide) - 1;
  if (slideIndex.value < max) slideIndex.value++;
  slide();
};

const prevSlide = () => {
  if (slideIndex.value > 0) slideIndex.value--;
  slide();
};

/* loan */
const showloanPopup = ref(false);
const selectedBook = ref(null);

const notify = ref({ show: false, message: "", type: "" });

const showNotify = (msg, type = "success-add") => {
  notify.value = { show: true, message: msg, type };
  setTimeout(() => (notify.value.show = false), 2200);
};

const loanBook = () => {
  selectedBook.value = product.value;
  showloanPopup.value = true;
};

const sendloan = async () => {
  try {
    await loanService.requestloan(selectedBook.value._id);
    showNotify("Gửi yêu cầu mượn thành công!", "success-add");
    showloanPopup.value = false;
  } catch (err) {
    showNotify("Yêu cầu mượn thất bại! Hết sách", "error");
  }
};

/* GO DETAIL */
const goDetail = (id) => {
  router.push(`/products/${id}`);
  window.scrollTo(0, 0);
};
</script>

<style scoped>
/* ----- DETAIL ----- */
.detail-wrapper {
  display: flex;
  gap: 28px;
  background: white;
  padding: 26px;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
}

.gallery {
  width: 35%;
}

.main-image {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.thumbs {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}

.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  border: 2px solid transparent;
}
.thumb.active,
.thumb:hover {
  opacity: 1;
  border-color: #0e4a32;
}

.info {
  width: 65%;
}

.book-title {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 14px;
  color: #09381e;
}

.desc {
  background: #fefefe;
  border-left: 4px solid #0e4a32;
  padding: 10px 14px;
  border-radius: 8px;
  margin-top: 6px;
}

.loan-btn {
  background: #0e764c;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  margin-top: 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  width: 30%;
}

.loan-btn:hover {
  background: #0c5c3a;
  transform: translateY(-2px);
}

/* ----- SLIDER ----- */
.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 16px;
}

.slider {
  display: flex;
  transition: transform .45s ease-in-out;
}

.related-item {
  flex: 0 0 20%;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  margin-right: 18px;
  cursor: pointer;
  transition: .25s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 320px;
}

.related-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}

.related-item img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 12px;
}

.r-title {
  font-size: 16px;
  font-weight: 700;
  color: #09381e;
  margin-top: 8px;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* NÚT SLIDE */
.slide-btn {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  color: white;
  background: rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: .2s ease;
  z-index: 20;
  opacity: 0;
}

.slider-container:hover .slide-btn {
  opacity: 1;
}

.slide-btn:hover {
  background: rgba(0, 0, 0, 0.55);
}

.slide-btn.left { left: 5px; }
.slide-btn.right { right: 5px; }


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
