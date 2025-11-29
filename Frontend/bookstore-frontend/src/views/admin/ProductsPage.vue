<template>
  <div class="page">
    <h1 class="title">
      <i class="fa-solid fa-book-open"></i>
      Quản lý sách
    </h1>

    <button class="add-btn" @click="openAdd">
      <i class="fa-solid fa-plus"></i> Thêm sách
    </button>

    <!-- Danh sách -->
    <table class="product-table">
      <thead>
        <tr>
          <th><i class="fa-solid fa-book"></i> Tên sách</th>
          <th><i class="fa-solid fa-user-pen"></i> Tác giả</th>
          <th><i class="fa-solid fa-calendar"></i> Năm</th>
          <th><i class="fa-solid fa-align-left"></i> Mô tả</th>
          <th><i class="fa-solid fa-gears"></i> Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in products" :key="p._id">
          <td>{{ p.title }}</td>
          <td>{{ p.author }}</td>
          <td>{{ p.year }}</td>
          <td>{{ p.description }}</td>

          <td class="action-col">
            <button class="edit-btn" @click="openEdit(p)">
              <i class="fa-solid fa-pen-to-square"></i> Sửa
            </button>

            <button class="delete-btn" @click="remove(p._id)">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <ProductForm
          :modelValue="selectedProduct"
          @save="saveProduct"
        />

        <button class="close-btn" @click="closeModal">
          <i class="fa-solid fa-xmark"></i> Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductForm from "../../components/ProductForm.vue";
import productService from "../../services/product.service";

const products = ref([]);
const showModal = ref(false);
const selectedProduct = ref(null);

// Load danh sách
const loadProducts = async () => {
  try {
    const res = await productService.getAll();

    console.log("RAW RESPONSE:", res);

    if (Array.isArray(res)) {
      products.value = res;
    } else {
      console.warn("API không trả về mảng");
      products.value = [];
    }

  } catch (e) {
    console.error("Lỗi loadProducts:", e);
  }
};


onMounted(loadProducts);

// mở modal thêm
const openAdd = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

// mở modal sửa
const openEdit = (product) => {
  selectedProduct.value = { ...product };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveProduct = async (data) => {
  if (selectedProduct.value?._id) {
    await productService.update(selectedProduct.value._id, data);
  } else {
    await productService.create(data);
  }

  closeModal();
  loadProducts();
};

const remove = async (id) => {
  if (confirm("Xóa sách này?")) {
    await productService.delete(id);
    loadProducts();
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* ======== Tiêu đề ======== */
.title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #0e4a32;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ======== Nút thêm sách ======== */
.add-btn {
  padding: 12px 20px;
  background: #176d45;
  color: white;
  border: none;
  border-radius: 8px;
  margin-bottom: 22px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: 0.2s;
}

.add-btn:hover {
  background: #0e4a32;
  transform: translateY(-2px);
}

/* ======== Bảng ======== */
.product-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.product-table th {
  background: #f3f3f3;
  font-weight: 700;
  padding: 14px;
  text-align: left;
  color: #333;
}

.product-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
}

.product-table tbody tr:hover {
  background: #fafafa;
}

/* ======== Nút hành động ======== */
.action-col {
  display: flex;
  gap: 10px;
}

.edit-btn {
  padding: 8px 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.edit-btn:hover {
  background: #217dbb;
}

.delete-btn {
  padding: 8px 14px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.delete-btn:hover {
  background: #c0392b;
}

/* ======== Modal ======== */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 14px;
  width: 520px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  animation: fadeIn 0.2s ease;
}

.close-btn {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  border: none;
  background: #555;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.close-btn:hover {
  background: #333;
}

/* ======== Animation ======== */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

</style>
