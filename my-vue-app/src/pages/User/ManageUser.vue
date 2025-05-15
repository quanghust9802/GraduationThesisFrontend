<template>
  <div class="p-4">
    <div class="flex justify-end  items-center mb-4 ">
      <button
        @click="openAddUserDialog"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded"
      >
        Thêm mới 
      </button>
    </div>

    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>

    <DataTable
      v-if="!loading && users.length"
      v-model="selectedUsers"
      :value="users"
      paginator
      :rows="10"
      :filters="filters"
      :sortField="sortField"
      :sortOrder="sortOrder"
      class="p-datatable-gridlines p-datatable-striped"
      dataKey="id"
      selectionMode="single"
      responsiveLayout="scroll"
      scrolable
    >
      <template #header>
        <div class="flex justify-between items-center">
  <span class="text-2xl text-gray-700">Danh sách người dùng</span>
  <div class="w-80"> 
    <InputText
      v-model="filters['global'].value"
      placeholder="Nhập để tìm kiếm..."
      class="p-inputtext-lg w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
    />
  </div>
</div>

      </template>

      <Column field="cccdId" header="CCCD" sortable></Column>
      <Column field="username" header="Tên đăng nhập" sortable></Column>
      <Column field="fullName" header="Họ và tên" sortable></Column>
      <Column field="gender" header="Giới tính" sortable>
        <template #body="slotProps">
          {{
            slotProps.data.gender === 1
              ? "Nam"
              : slotProps.data.gender === 2
              ? "Nữ"
              : ""
          }}
        </template>
      </Column>
      <Column field="phoneNumber" header="Số điện thoại" sortable></Column>
      <Column field="address" header="Địa chỉ" sortable></Column>
      <Column field="userRoleId" header="Vai trò" sortable>
        <template #body="slotProps">
          {{ ConvertRoleToString(slotProps.data.userRoleId) }}
        </template>
      </Column>
      <Column field="dateOfBirth" header="Ngày sinh" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.dateOfBirth) }}
        </template>
      </Column>
      <Column field="email" header="Email" sortable></Column>
      <Column header="Thao tác" class="min-w-[150px] sticky right-0 bg-gray-50 z-10">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-warning hover:border hover:border-yellow-400"
            @click="editUser(slotProps.data)"
            aria-label="Edit"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger hover:border hover:border-red-600 ml-2"
            @click="deleteUser(slotProps.data.cccdId)"
            aria-label="Delete"
          />
        </template>
      </Column>
    </DataTable>
    <Dialog
     :visible ="dialogVisible"
      :closable="true"
      :style="{ width: '40%', height: 'auto' }"
      header="Thông tin người dùng"
    >
      <UserForm :user="selectedUser" @save="saveUser" @close="dialogVisible = false" />
    </Dialog>

    <Toast ref="toast" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserForm from "./UserForm.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import {
  getUsers,
  insertUser,
  updateUser,
  disableUser,
  deleteUser 
} from "../../services/UserService/userService";
import { format } from "date-fns";

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    UserForm,
    ProgressSpinner,
    Toast,
  },
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const selectedUsers = ref(null);
    const dialogVisible = ref(false);
    const selectedUser = ref({});
    const filters = {
      global: { value: null, matchMode: "contains" },
    };
    const sortField = ref("fullName");
    const sortOrder = ref(1);
    const toast = ref(null);

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await getUsers();
        users.value = response?.data;
      } catch (error) {
        showToast("Lỗi khi lấy danh sách người dùng", "error");
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    const formatDate = (date) => {
      return date ? format(new Date(date), "dd/MM/yyyy") : "";
    };

    const openAddUserDialog = () => {
      selectedUser.value = null;
      dialogVisible.value = true;
    };

    const editUser = (user) => {
      selectedUser.value = { ...user };
      dialogVisible.value = true;
    };

    const ConvertRoleToString = (role) => {
      switch (role) {
        case 1:
          return "Quản trị hệ thống";
        case 3:
          return "Nhân viên nội bộ";
        case 4:
          return "Khách";
        default:
          return "";
      }
    };

    const saveUser = async (user) => {
      loading.value = true;
      try {
        if (user.id) {
          await updateUser(user.id, user);
          showToast("Cập nhật thông tin người dùng thành công", "success");
        } else {
          await insertUser(user);
          showToast("Thêm mới người dùng thành công", "success");
        }
        await fetchUsers();
        dialogVisible.value = false;
      } catch (error) {
        console.error("Failed to save user:", error);
        showToast("Lỗi khi lưu thông tin người dùng", "error");
      } finally {
        loading.value = false;
      }
    };

    const deleteUser = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        loading.value = true;
        try {
          await deleteUserService(id);
          users.value = users.value.filter((user) => user.Id !== id);
          showToast("Xóa người dùng thành công", "success");
        } catch (error) {
          console.error("Failed to delete user:", error);
          showToast("Lỗi khi xóa người dùng", "error");
        } finally {
          loading.value = false;
        }
      }
    };

    const showToast = (message, severity) => {
      toast.value.add({
        severity,
        summary: severity === "success" ? "Thành công" : "Lỗi",
        detail: message,
        life: 3000,
      });
    };

    return {
      users,
      loading,
      selectedUsers,
      dialogVisible,
      selectedUser,
      filters,
      sortField,
      sortOrder,
      fetchUsers,
      openAddUserDialog,
      editUser,
      saveUser,
      deleteUser,
      formatDate,
      ConvertRoleToString,
      toast,
    };
  },
};
</script>