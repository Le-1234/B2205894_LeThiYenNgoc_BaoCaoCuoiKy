<template>
  <div class="page-root">

    <!-- BACK BUTTON -->
    <button class="back-btn" @click="$router.push('/admin')">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div class="container">
      <h2 class="form-title">Quản lý mượn sách</h2>

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
/* Nền xanh lá đậm */
.page-root {
  background: #0e4a32;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;          
  position: center;    
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


/* Tiêu đề */
.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #064a1f;
  text-align: center;
  margin-bottom: 20px;
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

/* BACK BUTTON */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;

  display: flex;
  align-items: center;
  gap: 8px;

  background: white;
  color: #064a1f;
  border: 1px solid #0d6f3d;
  padding: 8px 14px;
  border-radius: 10px;

  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.back-btn:hover {
  background: #e6f7ec;
}

.back-btn i {
  font-size: 16px;
}

</style>
