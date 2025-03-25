<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl frigid-bold mb-6 text-center">Đăng ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Cột trái -->
          <div>
            <div class="mb-4">
              <label
                for="fullName"
                class="block text-sm font-medium text-gray-700"
                >Họ và tên</label
              >
              <input
                v-model="fullName"
                type="text"
                id="fullName"
                placeholder="Nhập tên"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.fullName.$error }"
                @blur="v$.fullName.$touch()"
              />
              <span v-if="v$.fullName.$error" class="text-red-500 text-sm">
                {{
                  v$.fullName.required.$invalid
                    ? "Vui lòng nhập họ và tên"
                    : !v$.fullName.minLength.$invalid
                    ? "Họ và tên phải có ít nhất 2 ký tự"
                    : ""
                }}
              </span>
            </div>

            <div class="mb-4">
              <label
                for="phoneNumber"
                class="block text-sm font-medium text-gray-700"
                >Số điện thoại</label
              >
              <input
                v-model="phoneNumber"
                type="tel"
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.phoneNumber.$error }"
                @blur="v$.phoneNumber.$touch()"
              />
              <span v-if="v$.phoneNumber.$error" class="text-red-500 text-sm">
                {{
                  v$.phoneNumber.required.$invalid
                    ? "Vui lòng nhập số điện thoại"
                    : v$.phoneNumber.phoneValid.$invalid
                    ? "Số điện thoại không hợp lệ"
                    : ""
                }}
              </span>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700"
                >Giới tính</label
              >
              <div class="flex items-center mt-1 space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="gender"
                    :value="1"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Nam</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="gender"
                    :value="2"
                    class="form-radio text-blue-600"
                  />
                  <span class="ml-2">Nữ</span>
                </label>
              </div>
              <span v-if="v$.gender.$error" class="text-red-500 text-sm">
                Vui lòng chọn giới tính
              </span>
            </div>

            <div class="mb-4">
              <label
                for="userName"
                class="block text-sm font-medium text-gray-700"
                >Tên đăng nhập</label
              >
              <input
                v-model="userName"
                type="text"
                id="userName"
                placeholder="Nhập tên đăng nhập"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.userName.$error }"
                @blur="v$.userName.$touch()"
              />
              <span v-if="v$.userName.$error" class="text-red-500 text-sm">
                {{
                  v$.userName.required.$invalid
                    ? "Vui lòng nhập tên đăng nhập"
                    : !v$.userName.minLength.$invalid
                    ? "Tên đăng nhập phải có ít nhất 4 ký tự"
                    : ""
                }}
              </span>
            </div>

            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Mật khẩu</label
              >
              <input
                v-model="password"
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.password.$error }"
                @blur="v$.password.$touch()"
              />
              <span v-if="v$.password.$error" class="text-red-500 text-sm">
                {{
                  v$.password.required.$invalid
                    ? "Vui lòng nhập mật khẩu"
                    : v$.password.minLength.$invalid
                    ? "Mật khẩu phải có ít nhất 6 ký tự"
                    : ""
                }}
              </span>
            </div>
          </div>

          <!-- Cột phải -->
          <div>
            <div class="mb-4">
              <label
                for="cccdId"
                class="block text-sm font-medium text-gray-700"
                >CCCD</label
              >
              <input
                v-model="cccdId"
                type="text"
                id="cccdId"
                placeholder="Nhập căn cước công dân"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.cccdId.$error }"
                @blur="v$.cccdId.$touch()"
              />
              <span v-if="v$.cccdId.$error" class="text-red-500 text-sm">
                {{
                  v$.cccdId.required.$invalid
                    ? "Vui lòng nhập CCCD"
                    : v$.cccdId.cccdValid.$invalid
                    ? "CCCD phải là 12 chữ số"
                    : ""
                }}
              </span>
            </div>

            <div class="mb-4">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700"
                >Địa chỉ</label
              >
              <input
                v-model="address"
                type="text"
                id="address"
                placeholder="Nhập địa chỉ"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="Nhập địa chỉ email"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                :class="{ 'border-red-500': v$.email.$error }"
                @blur="v$.email.$touch()"
              />
              <span v-if="v$.email.$error" class="text-red-500 text-sm">
                {{
                  v$.email.required.$invalid
                    ? "Vui lòng nhập email"
                    : !v$.email.email.$invalid
                    ? "Email không hợp lệ"
                    : ""
                }}
              </span>
            </div>

            <div class="mb-4">
              <label
                for="avatar"
                class="block text-sm font-medium text-gray-700"
                >Ảnh đại diện</label
              >
              <input
                type="file"
                id="avatar"
                accept="image/*"
                @change="handleFileChange"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <span v-if="avatarError" class="text-red-500 text-sm">{{
                avatarError
              }}</span>
              <div v-if="avatarPreview" class="mt-2">
                <img
                  :src="avatarPreview"
                  alt="Ảnh xem trước"
                  class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Nút submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          :disabled="loading || v$.$invalid"
        >
          <template v-if="loading">
            <ProgressSpinner
              style="width: 20px; height: 20px"
              strokeWidth="8"
            />
          </template>
          <template v-else>Đăng ký</template>
        </button>
      </form>
      <div class="mt-4 text-center">
        <span class="text-gray-600">Bạn đã có tài khoản?</span>
        <router-link to="/guest/login" class="text-blue-600 hover:underline"
          >Đăng nhập</router-link
        >
      </div>
    </div>
    <Toast ref="toast" />
  </div>
</template>

<script>
import { registerUser } from "../services/AuthService/authService";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email, helpers } from "@vuelidate/validators";

const phoneValid = helpers.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/);
const cccdValid = helpers.regex(/^\d{12}$/);

export default {
  components: {
    ProgressSpinner,
    Toast,
  },
  data() {
    return {
      fullName: "",
      phoneNumber: "",
      userName: "",
      password: "",
      address: "",
      email: "",
      cccdId: "",
      avatar: null, // Lưu file ảnh
      avatarPreview: null, // Lưu URL xem trước ảnh
      avatarError: "", // Lưu lỗi nếu có
      loading: false,
      gender: 1,
    };
  },
  validations: {
    fullName: { required, minLength: minLength(2) },
    phoneNumber: { required, phoneValid },
    userName: { required, minLength: minLength(4) },
    password: { required, minLength: minLength(6) },
    cccdId: { cccdValid, required },
    email: {  email },
    gender: {required}
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          this.avatarError = "Vui lòng chọn file ảnh hợp lệ";
          this.avatar = null;
          this.avatarPreview = null;
        } else {
          this.avatar = file;
          this.avatarError = "";
          this.avatarPreview = URL.createObjectURL(file);
        }
      } else {
        this.avatar = null;
        this.avatarPreview = null; 
      }
    },

    async handleRegister() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        this.$toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Vui lòng kiểm tra lại thông tin nhập vào.",
          life: 3000,
        });
        return;
      }

      // Tạo FormData để gửi dữ liệu kèm file
      const formData = new FormData();
      formData.append("FullName", this.fullName);
      formData.append("PhoneNumber", this.phoneNumber);
      formData.append("UserName", this.userName);
      formData.append("Password", this.password);
      formData.append("Address", this.address);
      formData.append("Email", this.email);
      formData.append("CccdId", this.cccdId);
      formData.append("Gender", this.gender);
      if (this.avatar) {
        formData.append("imageUrl", this.avatar);
      }

      this.loading = true;

      try {
        const response = await registerUser(formData);
        if (response.errCode === 200) {
          this.$toast.add({
            severity: "success",
            summary: "Thành công",
            detail: response.errDesc || "Đăng ký tài khoản thành công.",
            life: 3000,
          });
          this.$router.push("/guest/login");
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: response.errDesc || "Đăng ký tài khoản thất bại.",
            life: 3000,
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Có lỗi xảy ra, vui lòng thử lại sau!",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
  // Dọn dẹp URL tạm thời khi component bị hủy
  beforeUnmount() {
    if (this.avatarPreview) {
      URL.revokeObjectURL(this.avatarPreview);
    }
  },
};
</script>
