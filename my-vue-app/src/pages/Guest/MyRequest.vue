<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Danh sách yêu cầu</h1>
      <Button
        label="Thêm mới"
        icon="pi pi-plus"
        @click="showAddDialog = true"
        class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
      />
    </div>
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

    <Dialog
      :visible="showDetailDialog"
      header="Request Details"
      :style="{ width: '40vw' }"
      :modal="true"
      @update:visible="showDetailDialog = $event"
    >
      <div v-if="selectedRequest" class="grid grid-cols-2 gap-4">
        <div>Start: {{ formatDate(selectedRequest.startTime) }}</div>
        <div>End: {{ formatDate(selectedRequest.endTime) }}</div>
        <div class="col-span-2">Purpose: {{ selectedRequest.purpose }}</div>
      </div>
    </Dialog>

    <Dialog
      :visible="showAddDialog"
      header="Thêm yêu cầu mới"
      :style="{ width: '50vw' }"
      :modal="true"
      @update:visible="showAddDialog = $event"
    >
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="mb-2">Thời gian bắt đầu</label>
          <Calendar
            v-model="newRequest.startTime"
            dateFormat="yy-mm-dd"
            showIcon
            showTime
            :class="{ 'p-invalid': v$.newRequest.startTime.$error }"
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2"
          />
          <small v-if="v$.newRequest.startTime.$error" class="p-error">
            Vui lòng chọn thời gian bắt đầu
          </small>
        </div>
        <div class="flex flex-col">
          <label class="mb-2">Thời gian kết thúc</label>
          <Calendar
            v-model="newRequest.endTime"
            dateFormat="yy-mm-dd"
            showIcon
            showTime
            :class="{ 'p-invalid': v$.newRequest.endTime.$error }"
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2"
          />
          <small v-if="v$.newRequest.endTime.$error" class="p-error">
            Vui lòng chọn thời gian kết thúc
          </small>
        </div>
        <div class="flex flex-col col-span-2">
          <label class="mb-2">Mục đích</label>
          <textarea
            v-model="newRequest.purpose"
            :class="{ 'p-invalid': v$.newRequest.purpose.$error }"
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2"
            rows="3"
            placeholder="Nhập mục đích yêu cầu"
          />
          <small v-if="v$.newRequest.purpose.$error" class="p-error">
            Vui lòng nhập mục đích
          </small>
        </div>
      </div>
      <template #footer>
        <Button
          label="Hủy"
          icon="pi pi-times"
          @click="showAddDialog = false"
          class="p-button-outlined p-button-rounded p-button-lg px-6 py-3 text-gray-600 border-gray-400 transition-all duration-200 hover:bg-gray-200 hover:border-gray-500"
        />
        <Button
          label="Thêm"
          icon="pi pi-check"
          @click="submitNewRequest"
          :disabled="loading"
          class="p-button-success p-button-rounded p-button-lg px-6 py-3 transition-all duration-200 bg-green-500 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </template>
    </Dialog>
    <Toast ref="toast" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { getAccessRequests, getByFilter, createRequest } from "../../services/AccessRequestServices/accessRequestService";

export default {
  name: "MyRequest",
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
    const store = useStore();
    const toast = useToast();
    const filters = ref({
      startDate: null,
      endDate: null,
      status: null,
      userId: null,
    });

    const statusOptions = [
      { name: "Đang chờ", value: 0 },
      { name: "Đã duyệt", value: 1 },
      { name: "Từ chối", value: 2 },
    ];

    const showAddDialog = ref(false);
    const newRequest = ref({
      startTime: null,
      endTime: null,
      purpose: "",
    });

    // Validation rules
    const rules = {
      newRequest: {
        startTime: { required },
        endTime: { required },
        purpose: { required },
      },
    };
    const v$ = useVuelidate(rules, { newRequest });

    const fetchRequests = async () => {
      loading.value = true;
      try {
        const user = store.state.currentUser;
        const userId = user?.userId || null;

        if (filters.value.startDate || filters.value.endDate || filters.value.status !== null) {
          const response = await getByFilter(
            filters.value.startDate,
            filters.value.endDate,
            filters.value.status,
            userId
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

    const clearFilters = () => {
      filters.value = {
        startDate: null,
        endDate: null,
        status: null,
      };
      fetchRequests();
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleString() : "";
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
        "text-yellow-400": status === 0,
        "text-green-400": status === 1,
        "text-red-400": status === 2,
      };
    };

    const viewDetails = (request) => {
      selectedRequest.value = request;
      showDetailDialog.value = true;
    };

    const submitNewRequest = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Vui lòng kiểm tra lại thông tin nhập vào.",
      life: 3000,
    });
    return;
  }

  const user = store.state.currentUser;
  const formData = new FormData();

  const startTime = newRequest.value.startTime
    ? new Date(newRequest.value.startTime).toISOString()
    : null;
  const endTime = newRequest.value.endTime
    ? new Date(newRequest.value.endTime).toISOString()
    : null;

  formData.append("startTime", startTime);
  formData.append("endTime", endTime);
  formData.append("purpose", newRequest.value.purpose);
  formData.append("userId", user?.userId);
  formData.append("status", 0);

  loading.value = true;

  try {
    const response = await createRequest(formData);
    
    if (response.errCode === 200) {
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: response.errDesc || "Tạo yêu cầu thành công.",
        life: 3000,
      });
      
      newRequest.value = {
        startTime: null,
        endTime: null,
        purpose: "",
      };
      v$.value.$reset();
      showAddDialog.value = false;
      fetchRequests();
    } else {
      let errorDetail = response.errDesc || "Tạo yêu cầu thất bại.";
      if (response.errors) {
        errorDetail = Object.entries(response.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("; ");
      }
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: errorDetail,
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Có lỗi xảy ra, vui lòng thử lại sau!",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
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
      showAddDialog,
      newRequest,
      submitNewRequest,
      v$,
    };
  },
};
</script>

<style>
.card {
  @apply bg-white p-4 rounded-lg shadow-md;
}
.p-invalid {
  border-color: #ef4444 !important;
}
.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>