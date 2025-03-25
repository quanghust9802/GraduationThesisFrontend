<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Lịch sử ra vào của tôi</h1>

    <!-- Filter Section -->
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

    <!-- Logs Table -->
    <DataTable
      :value="accessLogs"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <Column field="id" header="Mã truy cập" sortable />
      <Column field="user.fullName" header="Người truy cập" sortable />
      <Column field="accessRequestId" header="Mã yêu cầu" sortable />
      <Column field="accessTime" header="Thời gian truy cập" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.accessTime) }}
        </template>
      </Column>
      <Column field="status" header="Trạng thái">
        <template #body="slotProps">
          <span
            :class="{
              'text-green-600 font-bold': slotProps.data.status === 1,
              'text-red-600 font-bold': slotProps.data.status === 0,
            }"
          >
            {{ slotProps.data.status === 1 ? "Granted" : "Denied" }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { ref, onMounted , computed} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useStore } from "vuex";
import {
  getAccessLogs,
  getByFilter,
} from "../../services/AccessLogServices/accessLogService";

export default {
  name: "AccessLog",
  components: {
    DataTable,
    Column,
    Calendar,
    InputText,
    Button,
  },
  setup() {
    const store = useStore();
    const accessLogs = ref([]);
    const loading = ref(false);
    const filters = ref({
      startDate: null,
      endDate: null,
    });

    const fetchLogs = async () => {
      loading.value = true;
      try {
        const startDate = filters.value.startDate || null;
        const endDate = filters.value.endDate || null;
        const user = computed(() => store.state.currentUser);
        const userId = computed(() => user.value?.userId || null);

        const data = await getByFilter(startDate, endDate, userId);
        accessLogs.value = data;
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
      loading.value = false;
    };

    const clearFilters = () => {
      filters.value = { startDate: null, endDate: null, requestId: "" };
      fetchLogs();
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    onMounted(() => {
      fetchLogs();
    });

    return {
      accessLogs,
      loading,
      filters,
      fetchLogs,
      clearFilters,
      formatDate,
    };
  },
};
</script>
