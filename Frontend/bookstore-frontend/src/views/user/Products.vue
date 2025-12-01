<template>
  <div class="page-root">

    <!-- BACK -->
    <button class="back-btn" @click="$router.push('/')">
      <i class="fa-solid fa-arrow-left"></i> Trang chủ
    </button>

    <div class="container">
      
      <h2 class="title">Tất cả sản phẩm</h2>

      <!-- TÌM KIẾM -->
      <input
        v-model="search"
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        class="search-box"
      />

      <!-- DANH MỤC -->
      <div class="category-bar">
        <div
          v-for="c in categories"
          :key="c._id"
          @click="selectCategory(c.name)"
          :class="['category-item', selectedCategory === c.name ? 'active' : '']"
        >
          {{ c.name }}
        </div>

        <!-- NÚT XEM TẤT CẢ -->
        <div
          class="category-item all"
          :class="{ active: selectedCategory === '' }"
          @click="selectCategory('')"
        >
          Tất cả
        </div>
      </div>

      <!-- DANH SÁCH SẢN PHẨM -->
      <div class="product-list">
        <div
          class="product-card"
          v-for="p in filteredProducts"
          :key="p._id"
          @click="$router.push('/product/' + p._id)"
        >
          <img :src="p.image" class="thumb" />
          <h3>{{ p.title }}</h3>
          <p class="price">{{ p.price }}₫</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import productService from "@/services/product.service";
import categoryService from "@/services/category.service";

const products = ref([]);
const categories = ref([]);

const search = ref("");
const selectedCategory = ref("");

const loadData = async () => {
  const p = await productService.getAll();
  products.value = p.data.data;

  const c = await categoryService.getAll();
  categories.value = c.data.data;
};

const selectCategory = (name) => {
  selectedCategory.value = name;
};

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.value.toLowerCase());
    const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    return matchSearch && matchCategory;
  });
});

onMounted(loadData);
</script>

<style scoped>
/* Nền xanh */
.page-root {
  background: #0e4a32;
  min-height: 100vh;
  padding: 40px 0;
}

/* Container trắng */
.container {
  width: 90%;
  max-width: 1000px;
  background: #ffffff;
  padding: 30px;
  border-radius: 14px;
  margin: auto;
  margin-top: 60px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

/* Tiêu đề */
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #064a1f;
}

/* Ô tìm kiếm */
.search-box {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin: 15px 0;
  border-radius: 10px;
  border: 1px solid #ccc;
}

/* Thanh danh mục */
.category-bar {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 10px;
  margin-bottom: 25px;
}

.category-bar::-webkit-scrollbar {
  height: 6px;
}

.category-item {
  padding: 8px 14px;
  background: #e9f6ef;
  border-radius: 10px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #cce8d8;
}

.category-item.active {
  background: #0d6f3d;
  color: white;
}

.category-item.all {
  background: #f1f1f1;
}

/* Lưới sản phẩm */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transition: 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.thumb {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.price {
  color: #0a7a22;
  font-weight: 700;
  margin-top: 8px;
}

/* Nút Back */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border: 1px solid #0d6f3d;
  color: #064a1f;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
.back-btn:hover { background: #e6f7ec; }
</style>
