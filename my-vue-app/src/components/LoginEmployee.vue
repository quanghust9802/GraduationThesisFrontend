<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative">
      <h2 class="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Nhập tên đăng nhập"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Nhập mật khẩu"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
          <span 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            @click="togglePasswordVisibility"
          >
            <i v-if="showPassword" class="pi pi-eye-slash"></i>
            <i v-else class="pi pi-eye"></i>
          </span>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          :disabled="loading" 
        >
          Đăng nhập
        </button>
      </form>

      <div v-if="loading" class="absolute inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
        <ProgressSpinner />
      </div>
    </div>

    <Toast />
  </div>
</template>

<script>
import { loginUser } from '../services/AuthService/authService'; 
import Toast  from 'primevue/toast'; 
import ProgressSpinner from 'primevue/progressspinner'; 
import {jwtDecode} from 'jwt-decode'; // 
export default {
  components: {
    ProgressSpinner,
    Toast,
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loading: false, 
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true; 
      try {
        const response = await loginUser(this.username, this.password); 
        if(response.flag){
          const token = response.token;
          this.$store.dispatch('login', token); 
          const decodedToken = jwtDecode(token);
          if(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'){
            this.$router.push('/admin/product'); 
          }
          else if(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Shipper'){
            this.$router.push('/staff/ship-view'); 
          }
          else if(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'QualityControl'){
            this.$router.push('/staff/quality-view'); 
          }
          else{
            this.$router.push('/staff/staff-view'); 
          }
          this.$toast.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });
        } else {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
        }
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Login failed!', life: 3000 });
        console.error('Login failed:', error);
      } finally {
        this.loading = false; 
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; 
    }
  }
};
</script>

<style>
</style>
