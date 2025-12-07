<template>
  <div>
    <h1>Search Results for "{{ keyword }}"</h1>
    <div v-if="results.length">
      <ul>
        <li v-for="product in results" :key="product._id">
          <img :src="getImage(product.image)" alt="Book Image" />
          <span>{{ product.title }}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No products found for "{{ keyword }}".</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // Để lấy query từ URL
import productService from "@/services/product.service";

const route = useRoute();
const keyword = ref(route.query.keyword || "");
const results = ref([]);

onMounted(async () => {
  if (keyword.value) {
    results.value = await productService.searchProducts(keyword.value);
  }
});

const getImage = (path) => {
  if (!path) return "/images/default-image.jpg";
  return `http://localhost:3000${path}`;
};
</script>

<style scoped>
/* Style kết quả tìm kiếm */
</style>

<style scoped>
/* Style hiển thị kết quả tìm kiếm */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

li img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

li span {
  font-size: 16px;
}

p {
  color: #888;
}
</style>
