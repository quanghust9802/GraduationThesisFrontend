<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-400">Yêu cầu của tôi</h2>

    <div class="mb-4 flex items-center justify-between gap-4">
      <Dropdown
        id="statusFilter"
        :options="statusOptions"
        v-model="selectedStatus"
        placeholder="Trạng thái yêu cầu"
        class="w-48 bg-blue-200"
      />
      <Button
        label="Thêm mới"
        icon="pi pi-plus"
         severity="success"
        class="p-button-success p-2 border-green-500"
        @click="showDialog = true"
      />
    </div>

    <div v-if="loading" class="flex justify-center mb-4">
      <ProgressSpinner />
    </div>

    <div
      v-else-if="requests.length === 0"
      class="text-center text-gray-500 font-xl"
    >
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
          {{
            slotProps.data.approvalAt
              ? formatDate(slotProps.data.approvalAt)
              : "Chưa duyệt"
          }}
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

    <!-- Dialog tạo mới request -->
    <Dialog
    :visible="showDialog"
    header="Thêm mới yêu cầu"
    :style="{ width: '550px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }"
    :modal="true"
    class="p-dialog-modern"
    @update:visible="showDialog = $event"
  >
    <div class="flex flex-col gap-6 p-6 bg-gray-50 rounded-b-lg">
      <!-- Thời gian bắt đầu -->
      <div class="space-y-2">
        <label class="block text-md font-semibold text-gray-800">Thời gian bắt đầu</label>
        <Calendar
          v-model="newRequest.startTime"
          showTime
          hourFormat="24"
          :minDate="new Date()"
          class="p-4 w-full  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Chọn thời gian bắt đầu"
          dateFormat="dd/mm/yy"
          panelClass="shadow-lg border-0"
        />
      </div>

      <!-- Thời gian kết thúc -->
      <div class="space-y-2">
        <label class="block text-md font-semibold text-gray-800">Thời gian kết thúc</label>
        <Calendar
          v-model="newRequest.endTime"
          showTime
          hourFormat="24"
          :minDate="newRequest.startTime || new Date()"
          class="p-4 w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Chọn thời gian kết thúc"
          dateFormat="dd/mm/yy"
          panelClass="shadow-lg border-0"
        />
      </div>

      <!-- Mục đích -->
      <div class="space-y-2">
        <label class="block text-md font-semibold text-gray-800">Mục đích</label>
        <Textarea
          v-model="newRequest.purpose"
          rows="4"
          class="w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-4"
          placeholder="Nhập mục đích của yêu cầu"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <Button
          label="Hủy"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary w-28 h-10 text-gray-700 hover:bg-gray-100 transition-colors duration-200 px-2 "
          @click="showDialog = false"
        />
        <Button
          label="Tạo"
          icon="pi pi-check"
          class="p-button-raised p-button-success w-28 h-10 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 px-2 "
          @click="handleCreate"
        />
      </div>
    </template>
  </Dialog>

  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import { format } from "date-fns";
import {
  getByStatus,
  createRequest,
} from "../../services/AccessRequestServices/accessRequestService.js";

export default {
  components: {
    DataTable,
    Column,
    Dropdown,
    ProgressSpinner,
    Button,
    Dialog,
    Calendar,
    Textarea,
  },
  setup() {
    const requests = ref([]);
    const selectedStatus = ref(0);
    const loading = ref(false);
    const showDialog = ref(false);

    const newRequest = ref({
      startTime: null,
      endTime: null,
      purpose: "",
    });

    const statusOptions = [
      { label: "Đang chờ", value: 0 },
      { label: "Đã duyệt", value: 1 },
      { label: "Bị từ chối", value: 2 },
      { label: "Đã hủy", value: 3 },
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
        const response = await getByStatus(userId, status);
        requests.value = response?.data;
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
    // Chỉ fetch lại nếu cần
    if (selectedStatus.value !== 3) {
      await fetchRequests(selectedStatus.value);
    }
  } catch (error) {
    console.error("Error cancelling request:", error);
  }
};


    const mapRequestStatus = (status) => {
      return statusMapping[status] || "Không xác định";
    };



    const handleCreate = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const requestData = {
          userRequestId: currentUser?.userId,
          startTime: newRequest.value.startTime,
          endTime: newRequest.value.endTime,
          purpose: newRequest.value.purpose,
          status: 0, 
          approvalAt: null,
        };

        await createRequest(requestData);
        showDialog.value = false;
        newRequest.value = { startTime: null, endTime: null, purpose: "" };
        // await fetchRequests(selectedStatus.value);
      } catch (error) {
        console.error("Error creating request:", error);
      }
    };

    watch(selectedStatus, (newStatus) => {
      fetchRequests(newStatus);
    });

    // onMounted(() => fetchRequests(0));

    return {
      requests,
      selectedStatus,
      statusOptions,
      fetchRequests,
      cancelRequest,
      loading,
      formatDate,
      mapRequestStatus,
      showDialog,
      newRequest,
      handleCreate,
    };
  },
};
</script>

<style scoped></style>
