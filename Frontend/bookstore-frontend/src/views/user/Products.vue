<template>
  <div class="page">

    <!-- HEADER -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-book"></i>
        <span>Tất cả sách</span>
      </div>
    </div>

    <!-- MAIN WHITE CONTAINER -->
    <div class="content-container">

      <!-- SEARCH BOX -->
      <div class="search-area">
        <SearchBox @go-detail="goDetail" />
      </div>

      <!-- CATEGORY FILTER -->
      <div class="filter-bar">
        <button
          :class="['filter-item', selectedCategory === 'all' ? 'active' : '']"
          @click="selectedCategory = 'all'"
        >
          Tất cả
        </button>

        <button
          v-for="cat in categories"
          :key="cat._id"
          :class="['filter-item', selectedCategory === cat._id ? 'active' : '']"
          @click="selectedCategory = cat._id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- PRODUCTS GRID -->
      <div class="product-grid">
        <div
          class="product-card"
          v-for="p in filteredProducts"
          :key="p._id"
          @click="goDetail(p._id)"
        >
        <img
        :src="getImage(p.image)"
        class="product-img"
        />
        <h3 class="product-title">{{ p.title }}</h3>
         <p class="product-qty">
           Còn lại:
           <strong>{{ p.quantity }}</strong> / {{ p.totalQuantity }}
         </p>
       </div>
     </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import productService from "../../services/product.service";
import SearchBox from "@/components/SearchBox.vue";
import "../../assets/main.css";

const router = useRouter();
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref("all");

const goDetail = (id) => {
  window.scrollTo(0, 0);
  router.push(`/product/${id}`);
};

const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") return products.value;
  return products.value.filter((p) => p.categoryId === selectedCategory.value);
});

// Load product
const loadProducts = async () => {
  try {
    const res = await productService.getAll();
    products.value = Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("Load products failed", e);
  }
};

// Load categories
const loadCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    categories.value = await res.json();
  } catch (e) {
    console.error("Load categories failed", e);
  }
};

onMounted(() => {
  loadProducts();
  loadCategories();
});

const getImage = (path) => {
  if (!path) return "";
  return `http://localhost:3000${path}`;
};

</script>

<style scoped>

.page {
  padding: 22px;
}

/* ================= HEADER ================= */
.page-header {
  width: 100%;
  background: #0e4a32;
  color: white;
  padding: 16px 22px;
  border-radius: 12px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 23px;
  font-weight: 700;
}

.back-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}


/* ================= WHITE CONTAINER ================= */
.content-container {
  background: white;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 8px 26px rgba(0,0,0,0.10);
}


/* ================= SEARCH ================= */
.search-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}


/* ================= CATEGORY FILTER ================= */
.filter-bar {
  margin-top: 6px;
  margin-bottom: 14px;

  display: flex;
  gap: 12px;

  overflow-x: auto;
  padding: 8px 4px;

  background: #f8fdfb;
  border-radius: 12px;
  border: 1px solid #e4f5ee;

  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.filter-item {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 20px;

  border: 1px solid #d0e8db;
  background: white;
  cursor: pointer;

  font-size: 15px;
  font-weight: 600;
  color: #0e4a32;

  transition: 0.2s;
}

.filter-item:hover {
  background: #e8f7ee;
}

.filter-item.active {
  background: #0e4a32;
  border-color: #0e4a32;
  color: white;
}


/* ================= PRODUCTS GRID ================= */
/* GRID giống Shopee: card sát nhau, cân đối */
.product-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

/* CARD */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 0;
  transition: 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* IMAGE lớn hơn giống Shopee */
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* CONTENT bên dưới */
.product-title,
.product-qty {
  padding: 0 10px;
}

/* Tiêu đề gần hình hơn */
.product-title {
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  min-height: 36px; /* cố định 2 dòng */
  color: #333;
}

/* Số lượng căn sát hơn giống Shopee */
.product-qty {
  margin-top: 4px;
  font-size: 13px;
  margin-bottom: 12px; /* tạo khoảng cách đáy */
}

/* Bọc toàn trang trong hộp trắng */
.page {
  background: #f5f5f5;
  padding: 16px;
}

.white-container {
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

</style>
