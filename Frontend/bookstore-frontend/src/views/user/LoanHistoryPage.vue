<template>
  <div class="page-root">

    <!-- ==== HEADER GIỐNG ADMIN ==== -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="title-wrapper">
        <i class="fa-solid fa-clock-rotate-left card-icon"></i>
        <span>Lịch sử mượn sách</span>
      </div>
    </div>

    <!-- ==== CONTENT ==== -->
    <div class="container">

      <h2 class="form-title">Danh sách mượn của bạn</h2>

      <div v-if="loading" class="loading">Đang tải...</div>

      <div v-for="b in loans" :key="b._id" class="loan-item">
        <div class="info">
          <p><b>Sách:</b> {{ b.title }}</p>

          <p>
            <b>Trạng thái:</b>
            <span class="status" :class="b.status">
              {{ statusText(b.status) }}
            </span>
          </p>

          <p><b>Ngày mượn:</b> {{ format(b.startDate) }}</p>
          <p><b>Hạn trả:</b> {{ format(b.dueDate) }}</p>
        </div>

        <div class="actions">

          <button
            class="btn cancel"
            v-if="b.status === 'pending'"
            @click="cancel(b._id)"
          >
            Hủy yêu cầu
          </button>

          <button
            class="btn return"
            v-if="b.status === 'approved'"
            @click="returnBook(b._id)"
          >
            Trả sách
          </button>

          <button
            class="btn extend"
            v-if="b.status === 'approved' && !b.extendUsed"
            @click="extend(b._id)"
          >
            Gia hạn 7 ngày
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import loanService from "../../services/loan.service";

const loans = ref([]);
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

async function load() {
  loading.value = true;
  const res = await loanService.getMyloans();
  loans.value = res.data.data;
  loading.value = false;
}

async function cancel(id) {
  await loanService.cancel(id);
  load();
}

async function returnBook(id) {
  await loanService.returnloan(id);
  load();
}

async function extend(id) {
  await loanService.extendloan(id);
  load();
}

onMounted(load);
</script>

<style scoped>
/* ==== NỀN ==== */
.page-root {
  background: #F7F7F7;
  min-height: 100vh;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
}

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

  position: sticky;
  top: 0;
  z-index: 50;
  isolation: isolate;
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

/* ==== CONTAINER ==== */
.container {
  width: 85%;
  max-width: 900px;
  background: #ffffff;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);

  margin-top: 40px;

  z-index: 2;
}

/* Tiêu đề phụ */
.form-title {
  font-size: 22px;
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

.loan-item {
  background: #f8fdf8;
  border: 1px solid #cfe8d1;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;

  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Văn bản */
.info p {
  margin: 5px 0;
  font-size: 15px;
}

/* ==== STATUS ==== */
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

/* ==== BUTTONS ==== */
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.extend {
  background: #1b8eeb;
  color: white;
}
.extend:hover {
  background: #156fbd;
}

/* Back button */
.back-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 8px 12px;
  border-radius: 8px;

  display: flex;
  align-items: center;
  gap: 6px;

  cursor: pointer;
  transition: 0.15s ease;
}

.back-btn:hover {
  background: rgba(255,255,255,0.25);
}
</style>
