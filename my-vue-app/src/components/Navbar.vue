<template>
  <nav class="flex items-center justify-between bg-blue-800 p-6 shadow-lg">
    <div class="flex items-center space-x-4">
      <router-link to="/" class="flex items-center">
        <img class="h-12 w-auto" src="../assets/logo.png" alt="Logo" />
        <span class="ml-2 text-white text-xl font-bold">Hệ thống kiểm soát ra vào</span>
      </router-link>
    </div>
    
    <div class="ml-auto flex items-center space-x-6">
      <div @click="showNotifications" class="relative cursor-pointer">
        <i class="pi pi-bell text-white text-3xl transition-transform duration-300 hover:scale-110"></i>
        <span class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">3</span>
      </div>


      <div v-if="user" class="flex items-center space-x-2">
        <i class="pi pi-user text-white text-3xl"></i> 
        <span class="text-white font-bold">{{ user.fullName }}</span> 
      </div>

      <button v-if="user" @click="logout" class="text-blue-800 bg-white px-4 py-2 rounded hover:font-bold hover:shadow-lg transition duration-300">Đăng xuất</button>
      <router-link v-if="!user" to="/guest/login" class="text-blue-800 bg-white px-4 py-2 rounded hover:font-bold hover:shadow-lg transition duration-300">Đăng nhập</router-link>
    </div>
  </nav>
</template>

<script>
import 'primeicons/primeicons.css';

export default {
  props: ['PathHome'],
  computed: {
    user() {
      return this.$store?.state?.currentUser || null;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    showNotifications() {
      console.log('Hiển thị thông báo');
    },
  }
};
</script>
