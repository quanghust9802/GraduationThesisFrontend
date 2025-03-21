<template>
  <div class="min-w-lg w-full mx-auto bg-white p-2 rounded">
    <h1 v-if="user && user.cccdId" class="text-xl font-bold mb-4">
      Cập nhật thông tin người dùng
    </h1>
    <h1 v-else class="text-xl font-bold mb-4">Thêm mới người dùng</h1>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">CCCD</label>
        <input
          v-model="form.cccdId"
          type="text"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập số CCCD"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Tên đăng nhập</label>
        <input
          v-model="form.username"
          type="text"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Mật khẩu</label>
        <input
          v-model="form.password"
          type="password"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Họ và tên</label>
        <input
          v-model="form.fullName"
          type="text"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập họ và tên"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Địa chỉ</label>
        <input
          v-model="form.address"
          type="text"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập địa chỉ"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Giới tính</label>
        <Dropdown
          v-model="form.gender"
          :options="genderOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Chọn giới tính"
          class="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Số điện thoại</label>
        <input
          v-model="form.phoneNumber"
          type="text"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="border border-gray-300 p-2 w-full"
          placeholder="Nhập email"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Ngày sinh</label>
        <Calendar
          v-model="form.dateOfBirth"
          dateFormat="dd/mm/yy"
          class="border border-gray-300 p-2 w-full"
          placeholder="Chọn ngày sinh"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-500 font-bold">Vai trò</label>
        <Dropdown
          v-model="form.userRoleId"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Chọn vai trò"
          class="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div class="w-full mr-8">
        <label class="block mb-2 text-gray-500 font-bold">Ảnh người dùng</label>
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="preview"
          class="rounded-md h-auto w-auto object-cover mx-auto shadow-xl"
        />
        <input
          type="file"
          id="main-image-upload"
          hidden
          @change="onSelectFile"
        />
        <label
          for="main-image-upload"
          class="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-6 mb-2 bg-blue-400 text-white hover:cursor-pointer rounded-md hover:bg-blue-500"
        >
          <div class="flex items-center my-2">
            <i class="pi pi-image mr-4"></i> <span>Tải ảnh</span>
          </div>
        </label>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition px-4"
        >
          Lưu
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { format } from "date-fns";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";

export default {
  components: {
    Calendar,
    Dropdown,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      form: {
        cccdId: "",
        username: "",
        password: "",
        fullName: "",
        address: "",
        gender: 1, 
        phoneNumber: "",
        dateOfBirth: null,
        userRoleId: 0, // Vai trò mặc định
        imageUrl: "",
        email: "",
      },
      roleOptions: [
        { label: "Quản trị hệ thống", value: 0 },
        { label: "Nhân viên nội bộ", value: 1 },
        { label: "Khách", value: 2 },
      ],
      genderOptions: [
        { label: "Nam", value: 1 },
        { label: "Nữ", value: 2 },
      ],
      imagePreview: null,
    };
  },
  watch: {
    user: {
      handler(newVal) {
        if (newVal) {
          this.form = {
            cccdId: newVal.cccdId || "",
            username: newVal.username || "",
            password: newVal.password || "", 
            fullName: newVal.fullName || "",
            address: newVal.address || "",
            gender: newVal.gender || 1,
            phoneNumber: newVal.phoneNumber || "",
            dateOfBirth: newVal.dateOfBirth
              ? format(new Date(newVal.dateOfBirth), "dd/MM/yyyy")
              : null,
            userRoleId: newVal.userRoleId || 0,
            imageUrl: newVal.imageUrl || "",
            email: newVal.email || "",
          };
          this.imagePreview = newVal.imageUrl;
        } else {
          this.form = {
            cccdId: "",
            username: "",
            password: "",
            fullName: "",
            address: "",
            gender: 1,
            phoneNumber: "",
            dateOfBirth: null,
            userRoleId: 0,
            imageUrl: "",
            email: "",
          };
          this.imagePreview = null;
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("save", this.form);
    },
    onSelectFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
        this.form.imageUrl = file; // Lưu file để gửi lên server
      }
    },
  },
};
</script>