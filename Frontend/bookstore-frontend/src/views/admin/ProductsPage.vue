<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/dashboard')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-book"></i>
        <span>Quản lý sách</span>
      </div>
    </div>


    <button class="add-btn" @click="openAdd">
      <i class="fa-solid fa-plus"></i> Thêm sách
    </button>

    <!-- Danh sách -->
    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th class="col-stt">STT</th>
            <th>Tên sách</th>
            <th>Thể loại</th>
            <th>Tác giả</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(product, index) in products" :key="product._id">
            <td class="col-stt">{{ index + 1 }}</td>
            <td>{{ product.title }}</td>
            <td>{{ getCategoryName(product.categoryId) }}</td>
            <td>{{ product.author }}</td>

            <td class="action-col">
              <button class="edit-btn" @click="openEdit(product)">
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </button>

              <button class="delete-btn" @click="openConfirm(product._id)">
                <i class="fa-solid fa-trash"></i> Xóa
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal" v-if="showModal">

    <ProductForm
      :modelValue="selectedProduct"
      @save="saveProduct"
          @close="closeModal"
        />
    </div>
    <!-- BACKDROP -->
    <div v-if="showConfirm" class="confirm-backdrop">
  
    <!-- MODAL -->
    <div class="confirm-box">
      <h3 class="confirm-title">Xác nhận</h3>
      <p class="confirm-message">Bạn có chắc muốn xóa sách này?</p>

      <div class="confirm-actions">
        <button class="btn-cancel" @click="showConfirm = false">Hủy</button>
        <button class="btn-ok" @click="confirmDelete">Xóa</button>
      </div>
    </div>
  </div>
    <div 
      v-if="notify.show"
      :class="['notify-box', notify.type]"
    >
      {{ notify.message }}
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
const categories = ref([]);


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

const loadCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    categories.value = await res.json();
  } catch (err) {
    console.error("Load categories failed:", err);
  }
};


onMounted(() => {
  loadCategories();
  loadProducts();
});

const getCategoryName = (id) => {
  const c = categories.value.find((x) => x._id === id);
  return c ? c.name : "Không rõ";
};

// mở modal thêm
const openAdd = () => {
  selectedProduct.value = {
    title: "",
    author: "",
    year: "",
    description: "",
    image: ""
  };
  showModal.value = true;
};

// mở modal sửa
const openEdit = (product) => {
  selectedProduct.value = {
    _id: product._id,
    title: product.title || "",
    categoryId: product.categoryId || "",
    author: product.author || "",
    year: product.year || "",
    description: product.description || "",
    publisher: product.publisher || "",
    coverType: product.coverType || "",
    image: product.image || "",
    detail1: product.detail1 || "",
    detail2: product.detail2 || "",
    quantity: product.quantity || 1,
    totalQuantity: product.totalQuantity || 1,
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const showNotify = (msg, type = "success-add") => {

  // Chuẩn hóa type
  const finalType = {
    "success": "success-update",   
    "add": "success-add",          
    "update": "success-update",
    "error": "error"
  }[type] || type;

  notify.value = {
    show: true,
    message: msg,
    type: finalType
  };

  setTimeout(() => (notify.value.show = false), 1500);
};

const saveProduct = async (data) => {
  try {
    if (selectedProduct.value?._id) {
      await productService.update(selectedProduct.value._id, data);

      closeModal();
      loadProducts();
      showNotify("Cập nhật sách thành công!", "update");
    } else {
      await productService.create(data);

      closeModal();
      setTimeout(() => {
      showNotify("Thêm sách mới thành công!", "add");
      }, 250);

      loadProducts();
    }
  } catch (err) {
    console.error("LỖI CREATE/UPDATE:", err);
    closeModal();

    setTimeout(() => {
      showNotify("Lỗi thêm sách! Vui lòng thử lại.", "error");
    }, 200);
  }
};


const showConfirm = ref(false);
const deleteId = ref(null);

const openConfirm = (id) => {
  deleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    if (!deleteId.value) {
      showNotify("Không tìm thấy ID để xóa!", "error");
      return;
    }

    await productService.delete(deleteId.value);

    showConfirm.value = false;
    loadProducts();

    showNotify("Xóa sách thành công!", "success");
  } catch (error) {
    showNotify("Lỗi xóa sách!", "error");
  }
};

const notify = ref({
  show: false,
  message: "",
  type: "success-add",
});

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
  background: rgb(53, 53, 202);
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
  background: #1c2297;
  transform: translateY(-2px);
}

/* ======== Bảng ======== */


.product-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #d8f3e1;
}

/* Header */
.product-table thead th {
  padding: 14px;
  text-align: left;
  color: white;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #0e764c, #0a5b3a);
  border-right: 1px solid rgba(255,255,255,0.25);
}

.product-table thead th:last-child {
  border-right: none;
}

.product-table tbody td {
  padding: 12px 14px; 
  border-bottom: 1px solid #e8f5ee; 
}

.table-wrapper {
  width: 80%;            
  margin: 0 auto;        
  display: flex;
  justify-content: center;
}


/* Kích thước cột */
.product-table td,
.product-table th {
  border-right: 1px solid #d0e9db; 
  text-align: center;
}


.product-table td:nth-child(2),
.product-table th:nth-child(2) {
  width: 360px;
}

.product-table td:nth-child(4),
.product-table th:nth-child(4) {
  width: 180px;
}
.product-table td:nth-child(5),
.product-table th:nth-child(5) {
  width: 180px;
}

/* Căn giữa 2 nút trong ô hành động */
.action-col {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

/* Edit button */
.edit-btn {
  padding: 7px 12px;
  background: #ffc107;
  color: white;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: 0.2s ease;
}

.edit-btn:hover {
  background: #E0A800;
  transform: translateY(-1px);
}

/* Delete button */
.delete-btn {
  padding: 7px 12px;
  background: #e74c3c;
  color: white;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: 0.2s ease;
}

.delete-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

/* ======== Modal ======== */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* ===== Notification box góc phải dưới ===== */
.notify-box {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 260px;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  animation: slideUpFade 0.35s ease;
  z-index: 9999;
}

.notify-box.success-add {
  background: #d4edda;
  color: #0f4e1f;
  border-left: 5px solid #0d6b3b;
}

.notify-box.success-update {
  background: #d3e4f3;
  color: #084298;
  border-left: 5px solid #0a4fa3;
}

.notify-box.error {
  background: #f8d7da;
  color: #842029;
  border-left: 5px solid #b32020;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* BACKDROP */
.confirm-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  z-index: 9998;
  animation: fadeIn 0.25s ease;
}

/* MODAL BOX */
.confirm-box {
  width: 360px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 14px;
  box-shadow: 0 6px 28px rgba(0,0,0,0.15);
  animation: popUp 0.25s ease;
}

.confirm-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #222;
}

.confirm-message {
  font-size: 15px;
  color: #555;
  margin-bottom: 20px;
}

/* BUTTON GROUP */
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* CANCEL BUTTON */
.btn-cancel {
  padding: 8px 14px;
  background: #ddd;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-cancel:hover {
  background: #ccc;
}

/* CONFIRM BUTTON */
.btn-ok {
  padding: 8px 16px;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-ok:hover {
  background: #d62839;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes popUp {
  from { transform: translateY(20px) scale(0.95); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

/* ===== HEADER ===== */
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

/* Tiêu đề bên trong */
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 24px;
  font-weight: 800;
}

.title-wrapper i {
  font-size: 22px;
}

/* Nút Back trên nền xanh */
.back-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 8px 12px;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: 0.15s ease;
}

.back-btn:hover {
  background: rgba(255,255,255,0.25);
}


</style>

