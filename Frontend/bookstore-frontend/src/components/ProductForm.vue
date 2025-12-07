<template>
  <div class="form-container">
    <!-- Nút X -->
     <button class="close-btn" @click="$emit('close')">
       ✖
     </button>
     <!-- Title -->
     <h2>
        <span v-if="!isEdit">
          <i class="fas fa-plus-circle" style="color:#0e4a32; margin-right:6px;"></i>
          Thêm sách mới
        </span>

        <span v-else>
          <i class="fas fa-edit" style="color:#0e4a32; margin-right:6px;"></i>
          Sửa sách
        </span>
      </h2>

     <form @submit.prevent="submitForm" class="scroll-area">

       <!-- FormGroup tích hợp -->
      <div class="form-group">
         <label>Tên sách</label>
         <input v-model="form.title" required />
       </div>
       <div class="form-group">
         <label>Danh mục</label>
         <select v-model="form.categoryId" required>
           <option value="">-- Chọn danh mục --</option>
           <option v-for="c in categories" :key="c._id" :value="c._id">
             {{ c.name }}
           </option>
         </select>
       </div>
       <div class="form-group">
         <label>Tác giả</label>
         <input v-model="form.author" required />
       </div>
       <div class="form-group">
         <label>Năm xuất bản</label>
         <input type="number" v-model="form.year" required />
       </div>
       <div class="form-group">
         <label>Nhà xuất bản</label>
         <input v-model="form.publisher" />
       </div>
       <div class="form-group">
         <label>Loại bìa</label>
         <select v-model="form.coverType" required>
           <option value="">-- Chọn loại bìa --</option>
           <option value="Bìa mềm">Bìa mềm</option>
           <option value="Bìa cứng">Bìa cứng</option>
         </select>
       </div>
       <div class="form-group">
         <label>Ảnh đại diện</label>
         <input type="file" @change="onFileChange($event, 'image')" />
         <img v-if="preview.image" :src="preview.image" class="preview-img" />
       </div>
       <div class="form-group">
         <label>Ảnh chi tiết 1</label>
         <input type="file" @change="onFileChange($event, 'detail1')" />
         <img v-if="preview.detail1" :src="preview.detail1" class="preview-img" />
       </div>
       <div class="form-group">
         <label>Ảnh chi tiết 2</label>
         <input type="file" @change="onFileChange($event, 'detail2')" />
         <img v-if="preview.detail2" :src="preview.detail2" class="preview-img" />
       </div>
       <div class="two-cols">
         <div class="form-group">
           <label>Số lượng</label>
           <input type="number" v-model="form.quantity" required />
         </div>
         <div class="form-group">
           <label>Tổng số lượng</label>
           <input type="number" v-model="form.totalQuantity" required />
         </div>
       </div>
       <div class="form-group">
         <label>Mô tả</label>
         <textarea v-model="form.description"></textarea>
       </div>
       <button class="submit-btn">
         {{ isEdit ? "Cập nhật" : "Thêm mới" }}
       </button>
     </form>
   </div>
</template>


<script setup>
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  modelValue: Object
});
const emit = defineEmits(["save", "close"]);

// 🎯 Notification
const notify = ref({
  show: false,
  message: "",
  type: "success",
});

const showNotify = (msg, type = "success") => {
  notify.value = { show: true, message: msg, type };
  setTimeout(() => (notify.value.show = false), 1500);
};

// Form data
const form = ref({
  title: "",
  categoryId: "",
  author: "",
  year: "",
  description: "",
  publisher: "",
  coverType: "",
  image: "",
  detail1: "",
  detail2: "",
  quantity: 1,
  totalQuantity: 1,
});

// Preview image
const preview = ref({
  image: null,
  detail1: null,
  detail2: null,
});

// Load categories
const categories = ref([]);
const loadCategories = async () => {
  const res = await fetch("http://localhost:3000/api/categories");
  categories.value = await res.json();
};

onMounted(() => loadCategories());

 // Load ảnh nếu có
 const getImage = (path) => {
   if (!path) return "";
   return `http://localhost:3000${path}`;
 };
// Edit mode
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.value = {
        title: val.title || "",
        categoryId: val.categoryId ? String(val.categoryId) : "",
        author: val.author || "",
        year: val.year || "",
        description: val.description || "",
        publisher: val.publisher || "",
        coverType: val.coverType ? String(val.coverType) : "",
        image: val.image || "",
        detail1: val.detail1 || "",
        detail2: val.detail2 || "",
        quantity: val.quantity || 1,
        totalQuantity: val.totalQuantity || 1,
      };

      preview.value = {
        image: val.image ? getImage(val.image) : null,
        detail1: val.detail1 ? getImage(val.detail1) : null,
        detail2: val.detail2 ? getImage(val.detail2) : null,
      };
    }
    else {
      // RESET khi Thêm mới
      form.value = {
        title: "",
        categoryId: "",
        author: "",
        year: "",
        description: "",
        publisher: "",
        coverType: "",
        image: "",
        detail1: "",
        detail2: "",
        quantity: 1,
        totalQuantity: 1,
      };
      preview.value = {
        image: null,
        detail1: null,
        detail2: null,
      };
    }
  },
  { immediate: true }
);

const isEdit = computed(() => !!props.modelValue?._id);

// Image select
const onFileChange = (e, field) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.value[field] = reader.result;
    form.value[field] = reader.result;
  };
  reader.readAsDataURL(file);
};

const submitForm = () => {
const data = { ...form.value };

  emit("save", data);};

</script>

<style scoped>

.form-container {
  position: relative;
  width: 480px;
  max-height: 85vh;
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;  /* THÊM */
}

.scroll-area {
  overflow-y: auto;        /* CUỘN Ở ĐÂY */
  max-height: calc(85vh - 70px);  /* CHÌA KHÓA */
  padding-right: 6px;
}

/* Notification */
.notify {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
}
.notify.success { background: #e7f7ed; color: #0e4a32; }
.notify.error { background: #fdecea; color: #c0392b; }

/* Close button */
.close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

/* Scrollable form */
.scroll-area {
  overflow-y: auto;
  padding-right: 6px;
}

/* Form group */
.form-group {
  margin-bottom: 14px;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

/* Inputs */
input, select, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
}

/* Two columns */
.two-cols {
  display: flex;
  gap: 12px;
}

/* Submit button */
.submit-btn {
  width: 100%;
  margin-top: 14px;
  padding: 12px;
  background: #0e4a32;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #0b3a27;
}

.preview-img {
  width: 100px;
  border-radius: 8px;
  margin-top: 6px;
  border: 1px solid #ccc;
}
</style>
