<template>
  <div class="container mx-auto p-4">
    <Card>
      <template #header>
        <h1 class="text-2xl font-bold p-4">Lịch sử ra vào của tôi</h1>
      </template>
      <template #content>
        <DataTable 
          :value="accessLogs" 
          :paginator="true" 
          :rows="10"
          :loading="loading"
          class="p-datatable-sm"
          responsiveLayout="scroll"
          :filters="filters"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." />
              </span>
            </div>
          </template>

          <Column field="accessTime" header="Thời gian truy cập" :sortable="true">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.accessTime) }}
            </template>
          </Column>

          <Column field="status" header="Trạng thái" :sortable="true">
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.status === 1 ? 'Được cấp phép' : 'Bị từ chối'"
                :severity="slotProps.data.status === 1 ? 'success' : 'danger'"
              />
            </template>
          </Column>

          <Column field="accessRequest.purpose" header="Mục đích">
            <template #body="slotProps">
              {{ slotProps.data.accessRequest?.purpose || 'N/A' }}
            </template>
          </Column>

          <Column field="accessRequest.startTime" header="Thời gian bắt đầu">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.accessRequest?.startTime) }}
            </template>
          </Column>

          <Column field="accessRequest.endTime" header="Thời gian kết thúc">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.accessRequest?.endTime) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex' 
import { getByUserId, getByRequestId, getByFilter } from "../../services/AccessLogServices/accessLogService.js";
import { FilterMatchMode } from 'primevue/api'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

export default {
  name: 'MyLog',
  components: {
    Card,
    DataTable,
    Column,
    InputText,
    Tag
  },
  setup() {
    const store = useStore()
    const userId = computed(() => store.state.userId) 
    const accessLogs = ref([])
    const loading = ref(false)
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })

    const fetchAccessLogs = async () => {
      loading.value = true
      try {
        if (userId.value) {
          accessLogs.value = await getByUserId(userId.value)
        }
      } catch (error) {
        console.error('Error fetching access logs:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }

    onMounted(fetchAccessLogs)

    return {
      accessLogs,
      loading,
      filters,
      formatDate
    }
  }
}
</script>
