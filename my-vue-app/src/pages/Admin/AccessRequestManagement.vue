<template>
  <div class="p-6">
    <!-- Filter Section -->
    <h1 class="text-2xl font-bold mb-4">Danh sách yêu cầu</h1>
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col">
          <label class="mb-2">Thời gian bắt đầu</label>
          <Calendar
            v-model="filters.startDate"
            dateFormat="yy-mm-dd"
            showIcon
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2">Thời gian kết thúc</label>
          <Calendar
            v-model="filters.endDate"
            dateFormat="yy-mm-dd"
            showIcon
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2">Trạng thái</label>
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Chọn trạng thái"
            class="w-48 p-inputtext border border-gray-300 rounded-md"
          />
        </div>
        <div class="flex items-center gap-3 mt-4">
          <Button
            label="Lọc"
            icon="pi pi-filter"
            @click="fetchRequests"
            class="border border-green-500 text-green-500 bg-white rounded-lg px-4 py-2 transition-all duration-200 hover:bg-green-500 hover:text-white"
          />
          <Button
            label="Xóa"
            icon="pi pi-times"
            @click="clearFilters"
            class="border border-red-500 text-red-500 bg-white rounded-lg px-4 py-2 transition-all duration-200 hover:bg-red-500 hover:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="accessRequests"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable />
      <Column field="requestUser" header="Người yêu cầu">
        <template #body="slotProps">
          {{ slotProps.data.requestUser?.username || "N/A" }}
        </template>
      </Column>
      <Column field="approveUser" header="Người duyệt">
        <template #body="slotProps">
          {{ slotProps.data.approveUser?.username || "N/A" }}
        </template>
      </Column>
      <Column field="startTime" header="Thời gian bắt đầu" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.startTime) }}
        </template>
      </Column>
      <Column field="endTime" header="Thời gian kết thúc" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.endTime) }}
        </template>
      </Column>
      <Column field="purpose" header="Mục đích" />
      <Column field="status" header="Trạng thái duyệt">
        <template #body="slotProps">
          <span :class="getStatusClass(slotProps.data.status)">
            {{ getStatusText(slotProps.data.status) }}
          </span>
        </template>
      </Column>
      <Column header="Thao tác">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-info mr-2"
            @click="viewDetails(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Detail Dialog -->
    <Dialog
      :visible="showDetailDialog"
      header="Request Details"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <div v-if="selectedRequest" class="grid grid-cols-2 gap-4">
        <div>ID: {{ selectedRequest.id }}</div>
        <div>Status: {{ getStatusText(selectedRequest.status) }}</div>
        <div>Requested By: {{ selectedRequest.requestUser?.username }}</div>
        <div>
          Approved By: {{ selectedRequest.approveUser?.username || "N/A" }}
        </div>
        <div>Start: {{ formatDate(selectedRequest.startTime) }}</div>
        <div>End: {{ formatDate(selectedRequest.endTime) }}</div>
        <div class="col-span-2">Purpose: {{ selectedRequest.purpose }}</div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";

export default {
  name: "AccessRequestManagement",
  components: {
    DataTable,
    Column,
    Button,
    Calendar,
    Dropdown,
    Dialog,
  },
  setup() {
    const accessRequests = ref([]);
    const loading = ref(false);
    const showDetailDialog = ref(false);
    const selectedRequest = ref(null);

    const filters = ref({
      startDate: null,
      endDate: null,
      status: null,
    });

    const statusOptions = [
      { name: "Đang chờ", value: 0 },
      { name: "Đã duyệt", value: 1 },
      { name: "Từ chối", value: 2 },
    ];

    const fetchRequests = async () => {
      loading.value = true;
      try {
        const response = await fetch("/api/access-requests", {
          params: {
            startDate: filters.value.startDate,
            endDate: filters.value.endDate,
            status: filters.value.status,
          },
        });
        accessRequests.value = await response.json();
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
      loading.value = false;
    };

    const clearFilters = () => {
      filters.value = {
        startDate: null,
        endDate: null,
        status: null,
      };
      fetchRequests();
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    const getStatusText = (status) => {
      switch (status) {
        case 0:
          return "Đang chờ";
        case 1:
          return "Đã duyệt";
        case 2:
          return "Từ chối";
      }
    };

    const getStatusClass = (status) => {
      return {
        "p-1 rounded text-white": true,
        "bg-yellow-500": status === 0,
        "bg-green-500": status === 1,
        "bg-red-500": status === 2,
      };
    };

    const viewDetails = (request) => {
      selectedRequest.value = request;
      showDetailDialog.value = true;
    };

    onMounted(() => {
      fetchRequests();
    });

    return {
      accessRequests,
      loading,
      filters,
      statusOptions,
      showDetailDialog,
      selectedRequest,
      fetchRequests,
      clearFilters,
      formatDate,
      getStatusText,
      getStatusClass,
      viewDetails,
    };
  },
};
</script>

<style>
.card {
  @apply bg-white p-4 rounded-lg shadow-md;
}
</style>
