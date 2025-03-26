<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative">
      <h2 class="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <!-- Tên đăng nhập -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Nhập tên đăng nhập"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            :class="{ 'border-red-500': v$.username.$error }"
            @blur="v$.username.$touch()"
          />
          <span v-if="v$.username.$error" class="text-red-500 text-sm">
            {{ v$.username.required.$invalid ? 'Vui lòng nhập tên đăng nhập' : '' }}
          </span>
        </div>

        <!-- Mật khẩu -->
        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Nhập mật khẩu"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            :class="{ 'border-red-500': v$.password.$error }"
            @blur="v$.password.$touch()"
          />
          <span 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            @click="togglePasswordVisibility"
          >
            <i v-if="showPassword" class="pi pi-eye-slash"></i>
            <i v-else class="pi pi-eye"></i>
          </span>
          <span v-if="v$.password.$error" class="text-red-500 text-sm">
            {{ 
              v$.password.required.$invalid 
                ? 'Vui lòng nhập mật khẩu' 
                : v$.password.minLength.$invalid 
                ? 'Mật khẩu phải có ít nhất 6 ký tự' 
                : '' 
            }}
          </span>
        </div>

        <!-- Nút đăng nhập -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          :disabled="loading"
        >
          Đăng nhập
        </button>
      </form>

      <!-- Progress Spinner -->
      <div v-if="loading" class="absolute inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
        <ProgressSpinner />
      </div>

      <div class="mt-4 text-center">
        <span class="text-gray-600">Bạn chưa có tài khoản?</span>
        <router-link to="/register" class="text-blue-600 hover:underline"> Đăng ký</router-link>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script>
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { loginGuest } from "../services/AuthService/authService";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";

export default {
  components: {
    ProgressSpinner,
    Toast,
  },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loading: false,
    };
  },
  validations: {
    username: { required },
    password: { required, minLength: minLength(6) },
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  methods: {
    async handleLogin() {
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


      this.loading = true;
      try {
        const response = await loginGuest(this.username, this.password);
        if (response.errCode === 200) {
          const token = response?.data?.token;
          this.$store.dispatch("login", token);
          this.$router.push("/guest/my-log");
          this.$toast.add({
            severity: "success",
            summary: "Thành công",
            detail: response.errDesc,
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: response.errDesc,
            life: 3000,
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Đăng nhập không thành công!",
          life: 3000,
        });
        console.error("Login failed:", error);
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>