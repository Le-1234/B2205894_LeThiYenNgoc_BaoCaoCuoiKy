<template>
  
  <div class="page-root">
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/dashboard')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-file-lines card-icon"></i>
        <span>Quản lý mượn sách</span>
      </div>
    </div>
    <div class="container">

      <div v-if="loading" class="loading">Đang tải...</div>

      <div
        v-for="b in borrows"
        :key="b._id"
        class="borrow-item"
      >
        <div class="info">
          <p><b>Người dùng:</b> {{ b.username }}</p>
          <p><b>Sách:</b> {{ b.title }}</p>

          <p>
            <b>Trạng thái:</b>
            <span class="status" :class="b.status">
              {{ statusText(b.status) }}
            </span>
          </p>

          <p><b>Ngày yêu cầu:</b> {{ format(b.createdAt) }}</p>
        </div>

        <div class="actions">
          <!-- DUYỆT -->
          <button
            class="btn return"
            v-if="b.status === 'pending'"
            @click="approve(b._id)"
          >
            Duyệt
          </button>

          <!-- TỪ CHỐI -->
          <button
            class="btn cancel"
            v-if="b.status === 'pending'"
            @click="reject(b._id)"
          >
            Từ chối
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import borrowService from "../../services/borrow.service";

const borrows = ref([]);
const loading = ref(true);

function format(date) {
  return date ? new Date(date).toLocaleDateString() : "—";
}

function statusText(s) {
  switch (s) {
    case "pending": return "Đang chờ duyệt";
    case "approved": return "Đang mượn";
    case "returned": return "Đã trả";
    case "rejected": return "Bị từ chối";
    case "canceled": return "Đã hủy";
  }
  return s;
}

/* Tải danh sách borrow */
async function load() {
  loading.value = true;
  const res = await borrowService.adminGetAll();
  borrows.value = res.data.data;
  loading.value = false;
}

/* Hành động */
async function approve(id) {
  await borrowService.approve(id);
  load();
}

async function reject(id) {
  await borrowService.reject(id);
  load();
}

onMounted(load);
</script>

<style scoped>
.page-root {
  background: #F7F7F7;
  min-height: 100vh;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0; 
}

/* ==== TIÊU ĐỀ === */
.page-header {
  width: 96%;
  background: #0e4a32;  
  color: white;

  padding: 20px 28px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  gap: 16px;

  box-shadow: 0 4px 14px rgba(0,0,0,0.15);

  z-index: 5; /* nổi lên trên nền */
  isolation: isolate; /* ngăn blending */
}

/* Tiêu đề */
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
color: white;
  font-size: 24px;
  font-weight: 800;
}


/* Khung trắng */
.container {
  width: 85%;
  max-width: 900px;
  background: #ffffff !important; 
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);

  margin: 0 auto;  
  margin-top: 70px;

  isolation: isolate;     
  z-index: 2;
}

/* Loading */
.loading {
  text-align: center;
  color: #064a1f;
  font-weight: 600;
}

/* Mỗi mục borrow */
.borrow-item {
  background: #f8fdf8;
  border: 1px solid #cfe8d1;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  color: #222;
}


.info p {
  margin: 5px 0;
  font-size: 15px;
}

/* Tag trạng thái */
.status {
  padding: 2px 9px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.status.pending { background: #fff3cd; color: #7a6200; }
.status.approved { background: #d4edda; color: #0f4e1f; }
.status.returned { background: #cce5ff; color: #084298; }
.status.rejected { background: #f8d7da; color: #842029; }
.status.canceled { background: #e2e3e5; color: #41464b; }
.status.extended { background: #a1c5cb; color: #003e49}

/* Buttons */
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 160px;
}

.btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  font-size: 14px;
}

/* Nút */
.cancel {
  background: #ffe3e3;
  color: #b20000;
}
.cancel:hover {
  background: #ffcdcd;
}

.return {
  background: #0a7a22;
  color: white;
}
.return:hover {
  background: #06651a;
}

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
