<template>
  <div class="search-wrapper">
    <div class="search-box">
      <input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm sách..."
        @input="filter"
        @focus="show = true"
      />
      <button @click="emitSearch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>

    <!-- Gợi ý -->
    <ul v-if="show && results.length" class="suggest-list">
      <li v-for="p in results" :key="p._id" @click="emitDetail(p._id)">
        <img :src="p.image" />
        <span>{{ p.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import productService from "@/services/product.service";

const emits = defineEmits(["go-detail"]);

const keyword = ref("");
const all = ref([]);
const results = ref([]);
const show = ref(false);

onMounted(async () => {
  all.value = await productService.getAll();
});

const filter = () => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return (results.value = []);

  results.value = all.value.filter((p) =>
    p.title.toLowerCase().startsWith(q)
  );
};

const emitDetail = (id) => {
  show.value = false;
  emits("go-detail", id); // Gửi id về trang cha
};

const emitSearch = () => {
  if (!keyword.value.trim()) return;
  emits("go-search", keyword.value);
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 480px;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  height: 42px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
}

.search-box input {
  padding: 10px 14px;
  border: none;
  width: 100%;
  outline: none;
  font-size: 15px;
}

.search-box button {
  width: 48px;
  background: #0a7a3a;
  border: none;
  color: white;
  cursor: pointer;
}

.suggest-list {
  position: absolute;
  top: 48px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  list-style: none;
  padding: 8px 0;
  max-height: 260px;
  overflow-y: auto;
  z-index: 9999;
}

.suggest-list li {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #0e4a32;
}

.suggest-list li:hover {
  background: #0e4a32;
  color: white;
}

.suggest-list img {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
