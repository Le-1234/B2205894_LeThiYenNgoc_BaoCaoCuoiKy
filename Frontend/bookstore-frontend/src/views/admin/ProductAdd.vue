<template>
  <div class="page">
    <h2 class="title">➕ Thêm sách mới</h2>

    <ProductForm @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ProductForm from "@/components/ProductForm.vue";
import productService from "@/services/product.service";

const router = useRouter();

const handleSubmit = async (formData) => {
  const res = await productService.create(formData);
  if (res && res._id) {
    alert("Thêm sách thành công!");
    router.push("/admin/products");
  } else {
    alert("Lỗi khi thêm sách!");
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
