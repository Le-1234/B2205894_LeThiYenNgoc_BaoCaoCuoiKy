<template>
  <div class="form-container">
    <h2>{{ isEdit ? "✏️ Sửa sách" : "➕ Thêm sách mới" }}</h2>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Tên sách</label>
        <input v-model="form.name" required />
      </div>

      <div class="form-group">
        <label>Tác giả</label>
        <input v-model="form.author" required />
      </div>

      <div class="form-group">
        <label>Mô tả</label>
        <textarea v-model="form.description"></textarea>
      </div>

      <div class="form-group">
        <label>Năm xuất bản</label>
        <input type="number" v-model="form.year" required />
      </div>

      <button class="submit-btn">
        {{ isEdit ? "Cập nhật" : "Thêm mới" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: { type: Object, default: null }
});
const emit = defineEmits(["save"]);

const form = ref({
  name: "",
  author: "",
  description: "",
  year: ""
});

const isEdit = computed(() => !!props.modelValue?._id);

// Load dữ liệu khi sửa
watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...val };
  },
  { immediate: true }
);

const submitForm = () => {
  emit("save", { ...form.value });
};
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 14px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background: #0e4a32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
