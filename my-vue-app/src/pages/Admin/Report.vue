<!-- Report.vue -->
<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Báo cáo truy cập</h1>
  
      <!-- Filter Section -->
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
  
      <!-- Statistics Section -->
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
  
      <!-- Chart Section (Optional) -->
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
  </style>