<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-400">Yêu cầu của tôi</h2>

    <div class="mb-4 flex items-center gap-4">
      <Dropdown
        id="statusFilter"
        :options="statusOptions"
        v-model="selectedStatus"
        placeholder="Trạng thái yêu cầu"
        class="w-48 bg-blue-200"
      />
    </div>

    <div v-if="loading" class="flex justify-center mb-4">
      <ProgressSpinner />
    </div>

    <div v-else-if="requests.length === 0" class="text-center text-gray-500 font-xl">
      Không có yêu cầu nào tồn tại
    </div>

    <DataTable v-else :value="requests" class="w-full">
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
      <Column field="status" header="Trạng thái" :sortable="true">
        <template #body="slotProps">
          {{ mapRequestStatus(slotProps.data.status) }}
        </template>
      </Column>
      <Column field="approvalAt" header="Thời gian duyệt" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvalAt ? formatDate(slotProps.data.approvalAt) : 'Chưa duyệt' }}
        </template>
      </Column>
      <Column header="Thao tác">
        <template #body="slotProps">
          <button
            v-if="slotProps.data.status === 0"
            @click="cancelRequest(slotProps.data.id)"
            class="bg-amber-500 text-white px-2 py-1 font-bold rounded hover:bg-amber-600"
          >
            Hủy yêu cầu
          </button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import ProgressSpinner from "primevue/progressspinner";
import { format } from "date-fns";
import { getAllRequestsByStatus } from "../../services/RequestService/requestService.js";

export default {
  components: {
    DataTable,
    Column,
    Dropdown,
    ProgressSpinner,
  },
  setup() {
    const requests = ref([]);
    const selectedStatus = ref(0);
    const loading = ref(false);

    const statusOptions = [
      { label: 'Đang chờ', value: 0 },
      { label: 'Đã duyệt', value: 1 },
      { label: 'Bị từ chối', value: 2 },
      { label: 'Đã hủy', value: 3 }
    ];

    const statusMapping = {
      0: "Đang chờ",
      1: "Đã duyệt",
      2: "Bị từ chối",
    };

    const fetchRequests = async (status) => {
      loading.value = true;
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userId = currentUser?.userId;

        const response = await getAllRequestsByStatus(userId, status);
        requests.value = response;
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    };

    const cancelRequest = async (requestId) => {
      try {
        requests.value = requests.value.map((request) =>
          request.id === requestId ? { ...request, status: 3 } : request
        );
        await fetchRequests(selectedStatus.value);
      } catch (error) {
        console.error("Error cancelling request:", error);
      }
    };

    const mapRequestStatus = (status) => {
      return statusMapping[status] || "Không xác định";
    };

    watch(selectedStatus, (newStatus) => {
      fetchRequests(newStatus);
    });

    onMounted(() => fetchRequests(0));

    return {
      requests,
      selectedStatus,
      statusOptions,
      fetchRequests,
      cancelRequest,
      loading,
      formatDate,
      mapRequestStatus,
    };
  },
};
</script>

<style scoped></style>