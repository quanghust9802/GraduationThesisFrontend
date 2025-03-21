<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r bg-amber-100 to-purple-600">
    <div class="bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 class="text-4xl font-extrabold text-gray-500 mb-4">Hệ thống quản lý ra vào </h1>
      <p class="text-gray-500 text-lg mb-6">Chọn vai trò của bạn</p>
      <div class="space-y-4">
        <button
          @click="redirectToEmployeeLogin"
          class="w-full bg-emerald-300 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Nhân viên
        </button>
        <button
          @click="redirectToCustomerLogin"
          class="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Khách 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToEmployeeLogin() {
      this.$router.push('/employee/login'); 
    },
    redirectToCustomerLogin() {
      this.$router.push('/guest/login'); 
    }
  }
};
</script>

<style scoped>
</style>
