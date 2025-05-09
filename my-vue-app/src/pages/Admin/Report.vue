<!-- <template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Báo cáo truy cập</h1>
  
      <div class="card mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex flex-col">
            <label class="mb-2">Thời gian bắt đầu</label>
            <Calendar v-model="filters.startDate" dateFormat="yy-mm-dd" showIcon class ="p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>
          <div class="flex flex-col">
            <label class="mb-2">Thời gian kết thúc</label>
            <Calendar v-model="filters.endDate" dateFormat="yy-mm-dd" showIcon class = "p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </div>
          <div class="flex items-end gap-3 mt-4">
            <Button label="Tạo báo cáo" icon="pi pi-chart-bar" @click="fetchStats"            class="border border-green-500 text-green-500 bg-white rounded-lg px-4 py-2 transition-all duration-200 hover:bg-green-500 hover:text-white"
            />
            <Button label="Xóa" icon="pi pi-times" class="border border-red-500 text-red-500 bg-white rounded-lg px-4 py-2 transition-all duration-200 hover:bg-red-500 hover:text-white" @click="clearFilters"  />
          </div>
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card">
          <h3 class="text-lg font-semibold">Tổng yêu cầu</h3>
          <p class="text-3xl">{{ stats.totalRequests }}</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold">Tổng được duyệt</h3>
          <p class="text-3xl">{{ stats.approvedRequests }}</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold">Tổng từ chối</h3>
          <p class="text-3xl">{{ stats.rejectedRequests }}</p>
        </div>
      </div>
  
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Tìm theo trạng thái</h3>
        <Chart type="bar" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import Calendar from 'primevue/calendar'
  import Button from 'primevue/button'
  import Chart from 'primevue/chart'
  
  export default {
    name: 'Report',
    components: {
      Calendar,
      Button,
      Chart
    },
    setup() {
      const filters = ref({
        startDate: null,
        endDate: null
      })
  
      const stats = ref({
        totalRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0
      })
  
      const chartData = ref({
        labels: ['Đang chờ', 'Đã duyệt', 'Từ chối'],
        datasets: [{
          label: 'Requests',
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
          data: [0, 0, 0]
        }]
      })
  
      const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      })
  
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/stats', {
            params: {
              startDate: filters.value.startDate,
              endDate: filters.value.endDate
            }
          })
          const data = await response.json()
          stats.value = data
          chartData.value.datasets[0].data = [data.pendingRequests, data.approvedRequests, data.rejectedRequests]
        } catch (error) {
          console.error('Error fetching stats:', error)
        }
      }
  
      const clearFilters = () => {
        filters.value = { startDate: null, endDate: null }
        fetchStats()
      }
  
      onMounted(() => {
        fetchStats()
      })
  
      return {
        filters,
        stats,
        chartData,
        chartOptions,
        fetchStats,
        clearFilters
      }
    }
  }
  </script>
  
  <style>
  .card {
    @apply bg-white p-4 rounded-lg shadow-md;
  }
  </style> -->
  <!-- Report.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Báo cáo yêu cầu truy cập</h1>

    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-semibold text-gray-600">Thời gian bắt đầu</label>
          <Calendar
            v-model="filters.startDate"
            dateFormat="yy-mm-dd"
            showIcon
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-semibold text-gray-600">Thời gian kết thúc</label>
          <Calendar
            v-model="filters.endDate"
            dateFormat="yy-mm-dd"
            showIcon
            class="p-inputtext border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-semibold text-gray-600">Trạng thái</label>
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Chọn trạng thái"
            class="w-48 p-inputtext border border-gray-300 rounded-md"
          />
        </div>
        <div class="flex items-end gap-3">
          <Button
            label="Tạo báo cáo"
            icon="pi pi-chart-bar"
            @click="fetchStats"
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-700">Tổng yêu cầu</h3>
        <p class="text-3xl text-gray-900">{{ stats.totalRequests }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-700">Tổng được duyệt</h3>
        <p class="text-3xl text-green-600">{{ stats.approvedRequests }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-700">Tổng từ chối</h3>
        <p class="text-3xl text-red-600">{{ stats.rejectedRequests }}</p>
      </div>
    </div>

    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-700">Thống kê theo trạng thái</h3>
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-64" />
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4 text-gray-700">Danh sách yêu cầu chi tiết</h3>
      <DataTable
        :value="requestList"
        :loading="loading"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column field="id" header="ID" sortable />
        <Column field="userRequestId" header="Người yêu cầu" sortable />
        <Column field="userApprovalid" header="Người duyệt" sortable>
          <template #body="slotProps">
            {{ slotProps.data.approveUser?.username }}
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
        <Column field="status" header="Trạng thái">
          <template #body="slotProps">
            <span :class="getStatusClass(slotProps.data.status)">
              {{ getStatusText(slotProps.data.status) }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Chart from "primevue/chart";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import { getByFilter } from "../../services/AccessRequestServices/accessRequestService"; // Giả định service

export default {
  name: "Report",
  components: {
    Calendar,
    Button,
    Chart,
    DataTable,
    Column,
    Dropdown,
  },
  setup() {
    const filters = ref({
      startDate: null,
      endDate: null,
      status: null,
    });

    const statusOptions = ref([
      { name: "Tất cả", value: null },
      { name: "Đang chờ", value: 0 },
      { name: "Đã duyệt", value: 1 },
      { name: "Từ chối", value: 2 },
    ]);

    const stats = ref({
      totalRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      pendingRequests: 0,
    });

    const requestList = ref([]);
    const loading = ref(false);

    const chartData = ref({
      labels: ["Đang chờ", "Đã duyệt", "Từ chối"],
      datasets: [
        {
          label: "Số lượng yêu cầu",
          backgroundColor: ["#f59e0b", "#10b981", "#ef4444"],
          data: [0, 0, 0],
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Số lượng",
          },
        },
      },
    });

    const fetchStats = async () => {
      loading.value = true;
      try {
        const response = await getByFilter(
          filters.value.startDate,
          filters.value.endDate,
          filters.value.status
        );
        const data = response?.data || [];

        requestList.value = data;

        stats.value.totalRequests = data.length;
        stats.value.pendingRequests = data.filter((r) => r.status === 0).length;
        stats.value.approvedRequests = data.filter((r) => r.status === 1).length;
        stats.value.rejectedRequests = data.filter((r) => r.status === 2).length;

        chartData.value.datasets[0].data = [
          stats.value.pendingRequests,
          stats.value.approvedRequests,
          stats.value.rejectedRequests,
        ];
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        loading.value = false;
      }
    };

    const clearFilters = () => {
      filters.value = { startDate: null, endDate: null, status: null };
      fetchStats();
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleString() : "N/A";
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
        // "p-1 rounded text-white text-sm": true,
        "text-yellow-500": status === 0,
        "text-green-500": status === 1,
        "text-red-500": status === 2,
      };
    };

    onMounted(() => {
      fetchStats();
    });

    return {
      filters,
      stats,
      chartData,
      chartOptions,
      requestList,
      loading,
      statusOptions,
      fetchStats,
      clearFilters,
      formatDate,
      getStatusText,
      getStatusClass,
    };
  },
};
</script>

<style scoped>
.card {
  @apply bg-white p-4 rounded-lg shadow-md;
}
</style>