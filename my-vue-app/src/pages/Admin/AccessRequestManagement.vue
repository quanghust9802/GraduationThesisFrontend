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
      <Column field="requestUser.fullName" header="Người yêu cầu">
        <!-- <template #body="slotProps">
          {{ slotProps.data.requestUser.fullName || "Trống" }}
        </template> -->
      </Column>
      <Column field="approveUser.fullName" header="Người duyệt">
        <!-- <template #body="slotProps">
          {{ slotProps.data.approveUser?.fullName || "Trống" }}
        </template> -->
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
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info"
              @click="viewDetails(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 0"
              icon="pi pi-check"
              class="p-button-rounded p-button-success"
              @click="approveRequest(slotProps.data.id)"
              title="Duyệt"
            />
            <Button
              v-if="slotProps.data.status === 0"
              icon="pi pi-times"
              class="p-button-rounded p-button-danger"
              @click="rejectRequest(slotProps.data.id)"
              title="Từ chối"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog
      :visible="showDetailDialog"
      header="Chi tiết yêu cầu ra vào"
      :style="{ width: '50vw' }"
      :modal="true"
      :closable="true"
      class="rounded-lg shadow-lg"
    >
      <div v-if="selectedRequest" class="p-4 bg-white rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Trạng thái</label
            >
            <span
              :class="[
                'mt-1 block w-full p-2 border border-gray-300 rounded-md',
                selectedRequest.status === 0 ? 'text-yellow-400' : '',
                selectedRequest.status === 1 ? 'text-green-400' : '',
                selectedRequest.status === 2 ? 'text-red-400' : '',
              ]"
            >
              {{ getStatusText(selectedRequest.status) }}
            </span>
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Người yêu cầu</label
            >
            <InputText
              :value="selectedRequest.requestUser?.username"
              disabled
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Người duyệt</label
            >
            <InputText
              :value="selectedRequest.approveUser?.username"
              disabled
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Thời gian bắt đầu</label
            >
            <InputText
              :value="formatDate(selectedRequest.startTime)"
              disabled
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Thời gian kết thúc</label
            >
            <InputText
              :value="formatDate(selectedRequest.endTime)"
              disabled
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="col-span-1 md:col-span-2 flex flex-col">
            <label class="text-sm font-semibold text-gray-600 mb-1"
              >Mục đích</label
            >
            <Textarea
              :value="selectedRequest?.purpose"
              disabled
              rows="3"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md "
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Đóng"
          @click="showDetailDialog = false"
          class="p-button-outlined p-button-rounded p-button-lg px-6 py-3 text-gray-600 border-gray-400 transition-all duration-200 hover:bg-gray-200 hover:border-gray-500"
        />
      </template>
    </Dialog>

    <Toast ref="toast" />
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
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import {
  getByFilter,
  getAccessRequests,
  updateStatus,
} from "../../services/AccessRequestServices/accessRequestService";

export default {
  name: "AccessRequestManagement",
  components: {
    DataTable,
    Column,
    Button,
    Calendar,
    Dropdown,
    Dialog,
    Toast,
  },
  setup() {
    const accessRequests = ref([]);
    const loading = ref(false);
    const showDetailDialog = ref(false);
    const selectedRequest = ref(null);
    const toast = useToast();

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
        if (
          filters.value.startDate ||
          filters.value.endDate ||
          filters.value.status !== null
        ) {
          const response = await getByFilter(
            filters.value.startDate,
            filters.value.endDate,
            filters.value.status
          );
          accessRequests.value = response?.data || [];
        } else {
          const response = await getAccessRequests();
          accessRequests.value = response?.data || [];
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể tải danh sách yêu cầu",
          life: 3000,
        });
      } finally {
        loading.value = false;
      }
    };

    const approveRequest = async (requestId) => {
      loading.value = true;
      var response = await updateStatus(requestId, 1);
      if (response?.errCode === 200) {
        toast.add({
          severity: "success",
          summary: "Thành công",
          detail: "Yêu cầu đã được duyệt",
          life: 3000,
        });
        await fetchRequests();
        loading.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Đã xảy ra lỗi duyệt yêu cầu",
          life: 3000,
        });
        loading.value = false;
      }
    };

    const rejectRequest = async (requestId) => {
      loading.value = true;
      var response = await updateStatus(requestId, 2);
      if (response?.errCode === 200) {
        toast.add({
          severity: "success",
          summary: "Thành công",
          detail: "Từ chối yêu cầu thành công",
          life: 3000,
        });
        await fetchRequests();
        loading.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Đã xảy ra lỗi từ chối yêu cầu",
          life: 3000,
        });
        loading.value = false;
      }
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
        // "p-1 rounded text-white": true,
        "text-yellow-400": status === 0,
        "text-green-400": status === 1,
        "text-red-400": status === 2,
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
      approveRequest,
      rejectRequest,
    };
  },
};
</script>

<style>
.card {
  @apply bg-white p-4 rounded-lg shadow-md;
}
</style>
