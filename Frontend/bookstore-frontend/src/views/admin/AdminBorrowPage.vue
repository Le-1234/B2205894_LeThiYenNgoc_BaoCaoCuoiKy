<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-3">Quản lý mượn sách</h1>

    <table class="table-auto w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">User</th>
          <th class="p-2">Sách</th>
          <th class="p-2">Trạng thái</th>
          <th class="p-2">Hạn trả</th>
          <th class="p-2">Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="b in list" :key="b._id" class="border-b">
          <td class="p-2">{{ b.userId }}</td>
          <td class="p-2">{{ b.productId }}</td>
          <td class="p-2">{{ b.status }}</td>
          <td class="p-2">{{ new Date(b.dueDate).toLocaleDateString() }}</td>
          <td class="p-2 space-x-2">
            <button v-if="b.status==='requested'" class="btn btn-green" @click="approve(b._id)">Duyệt</button>
            <button v-if="b.status==='requested'" class="btn btn-red" @click="reject(b._id)">Từ chối</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BorrowService from "../../services/borrow.service";

export default {
  data() {
    return {
      list: []
    };
  },

  async created() {
    const res = await BorrowService.adminGetAll();
    this.list = res.data.data;
  },

  methods: {
    async approve(id) {
      await BorrowService.approve(id);
      this.list = this.list.map(x => x._id === id ? { ...x, status: "approved" } : x);
    },

    async reject(id) {
      await BorrowService.reject(id);
      this.list = this.list.map(x => x._id === id ? { ...x, status: "rejected" } : x);
    }
  }
};
</script>
