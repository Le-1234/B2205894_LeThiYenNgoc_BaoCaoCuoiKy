<template>
  <div class="page">
    <h2 class="title">✏️ Chỉnh sửa sách</h2>

    <ProductForm v-if="loaded" :model="book" @submit="handleSubmit" />
    <p v-else>Đang tải dữ liệu...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ProductForm from "@/components/ProductForm.vue";
import productService from "@/services/product.service";

const router = useRouter();
const route = useRoute();

const book = ref(null);
const loaded = ref(false);

onMounted(async () => {
  const id = route.params.id;
  const data = await productService.getById(id);

  if (!data) {
    alert("Không tìm thấy sách!");
    return router.push("/admin/products");
  }

  book.value = data;
  loaded.value = true;
});

const handleSubmit = async (formData) => {
  const id = route.params.id;
  const res = await productService.update(id, formData);

  if (res && res._id) {
    alert("Cập nhật sách thành công!");
    router.push("/admin/products");
  } else {
    alert("Lỗi khi cập nhật!");
  }
};
</script>

<style scoped>
.page {
  padding: 20px 10px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #0e4a32;
}
</style>
