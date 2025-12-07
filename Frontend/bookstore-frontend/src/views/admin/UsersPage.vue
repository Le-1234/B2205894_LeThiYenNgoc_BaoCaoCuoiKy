<template>
  <div class="page">

    <!-- HEADER -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/dashboard')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-users"></i>
        <span>Quản lý người dùng</span>
      </div>
    </div>

    <!-- VIEW DETAIL -->
    <div v-if="showView" class="view-backdrop">
      <div class="view-box">
        <h2 class="view-title">Thông tin người dùng</h2>

        <div class="view-content">
          <p><strong>Username:</strong> {{ viewUser.username }}</p>
          <p><strong>Email:</strong> {{ viewUser.email }}</p>
          <p><strong>Role:</strong> {{ viewUser.role }}</p>
          <p><strong>Ngày tạo:</strong> {{ formatDate(viewUser.createdAt) }}</p>
        </div>

        <button class="btn-close-view" @click="showView = false">Đóng</button>
      </div>
    </div>

    <!-- USER TABLE -->
    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(u, index) in users" :key="u._id">
            <td>{{ index + 1 }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>

            <td class="action-col">
              <button class="view-btn" @click="openView(u)">
                <i class="fa-solid fa-eye"></i> Xem
              </button>

              <button class="delete-btn" @click="openConfirm(u._id)">
                <i class="fa-solid fa-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CONFIRM DELETE -->
    <div v-if="showConfirm" class="confirm-backdrop">
      <div class="confirm-box">
        <h3 class="confirm-title">Xác nhận</h3>
        <p class="confirm-message">Bạn có chắc muốn xóa người dùng này?</p>

        <div class="confirm-actions">
          <button class="btn-cancel" @click="showConfirm = false">Hủy</button>
          <button class="btn-ok" @click="confirmDelete">Xóa</button>
        </div>
      </div>
    </div>

    <!-- NOTIFY -->
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
import SearchBox from "@/components/SearchBox.vue";
import userService from "@/services/user.service";

/* ========== STATE ========== */
const users = ref([]);
const allUsers = ref([]);
const showConfirm = ref(false);
const showView = ref(false);

const deleteId = ref(null);
const viewUser = ref({});

const notify = ref({
  show: false,
  message: "",
  type: "success-add"
});

/* ========== LOAD USERS ========== */
const loadUsers = async () => {
  try {
    const res = await userService.adminGetAll();
    users.value = res.data.data;
    allUsers.value = res.data.data; 
  } catch (err) {
    console.error("Load user error:", err);
  }
};

onMounted(loadUsers);

/* ========== VIEW USER ========== */
const openView = (u) => {
  if (!u) return;
  viewUser.value = { ...u };
  showView.value = true;
};

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleString();
};

/* ========== DELETE USER ========== */
const openConfirm = (id) => {
  deleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    await userService.adminDelete(deleteId.value); 
    showConfirm.value = false;
    await loadUsers();
    showNotify("Xóa người dùng thành công!", "success-update");
  } catch (err) {
    console.error(err);
    showNotify("Lỗi khi xóa!", "error");
  }
};

/* ========== NOTIFY ========== */
const showNotify = (msg, type = "success-add") => {
  notify.value = { show: true, message: msg, type };
  setTimeout(() => (notify.value.show = false), 1500);
};
</script>

<style scoped>
.view-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.view-box {
  width: 600px;
  background: #fff;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.2);
  animation: popUp .25s ease;
}

.view-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #0e4a32;
}

.view-content p {
  margin: 6px 0;
  font-size: 15px;
}

.images {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.images img {
  width: 120px;
  height: auto;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.btn-close-view {
  margin-top: 18px;
  width: 100%;
  padding: 10px;
  background: #0e4a32;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.view-btn {
  padding: 7px 12px;
  background: #20608a;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  gap: 6px;
  align-items: center;
}
.view-btn:hover {
  background: #2c80b4;
}

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
  background: #dbab1b;
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
  background: #bd3f31;
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

