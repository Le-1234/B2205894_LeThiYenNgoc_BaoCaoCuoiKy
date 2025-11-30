<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-3">Lịch sử mượn sách</h1>

    <div v-for="b in list" :key="b._id" class="border p-3 mb-3 rounded">
      <div>Sách: {{ b.productId }}</div>
      <div>Trạng thái: {{ b.status }}</div>
      <div>Hạn trả: {{ new Date(b.dueDate).toLocaleDateString() }}</div>

      <div class="mt-2 space-x-2">
        <button
          v-if="b.status==='approved' && !b.extended"
          class="btn btn-blue"
          @click="extend(b._id)">
          Gia hạn
        </button>

        <button
          v-if="b.status==='approved' || b.status==='extended'"
          class="btn btn-green"
          @click="returnBook(b._id)">
          Đã trả
        </button>

        <button
          v-if="b.status==='requested'"
          class="btn btn-red"
          @click="cancel(b._id)">
          Hủy yêu cầu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "../../services/borrow.service";

export default {
  data() {
    return { list: [] };
  },

  async created() {
    const res = await BorrowService.getMyBorrows();
    this.list = res.data.data;
  },

  methods: {
    async extend(id) {
      await BorrowService.extendBorrow(id);
      location.reload();
    },

    async returnBook(id) {
      await BorrowService.returnBorrow(id);
      location.reload();
    },

    async cancel(id) {
      await BorrowService.cancelBorrow(id);
      location.reload();
    },
  }
};
</script>
