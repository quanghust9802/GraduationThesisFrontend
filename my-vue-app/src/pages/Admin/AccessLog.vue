<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Lịch sử ra vào</h1>

    <!-- Filter Section -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col">
          <label class="mb-2">Thời gian bắt đầu</label>
          <Calendar
            v-model="filters.startDate"
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2">Thời gian kết thúc</label>
          <Calendar v-model="filters.endDate" dateFormat="yy-mm-dd" showIcon />
        </div>
        <div class="flex flex-col">
          <label class="mb-2">Người yêu cầu</label>
          <InputText
            v-model="filters.requestId"
            placeholder="Enter Request ID"
          />
        </div>
        <div class="flex items-end">
          <Button label="Filter" icon="pi pi-filter" @click="fetchLogs" />
          <Button
            label="Clear"
            icon="pi pi-times"
            class="ml-2 p-button-secondary"
            @click="clearFilters"
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
      <Column field="id" header="Log ID" sortable />
      <Column field="user.fullName" header="User" sortable />
      <Column field="accessRequestId" header="Request ID" sortable />
      <Column field="accessTime" header="Access Time" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.accessTime) }}
        </template>
      </Column>
      <Column field="status" header="Status">
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
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { getAccessLogs,getByFilter } from "../../services/AccessLogServices/accessLogService";

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
    const accessLogs = ref([]);
    const loading = ref(false);
    const filters = ref({
      startDate: null,
      endDate: null,
      requestId: "",
    });

    const fetchLogs = async () => {
      loading.value = true;
      try {
        const startDate = filters.value.startDate || null;
        const endDate = filters.value.endDate || null;
        const requestId = filters.value.requestId || null;

        const data = await getByFilter(startDate, endDate, requestId);
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
