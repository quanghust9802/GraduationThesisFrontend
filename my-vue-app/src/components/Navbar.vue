<!-- <template>
  <nav class="flex items-center justify-between bg-blue-900 p-10 shadow-lg relative">
    <div class="flex items-center space-x-4">
      <router-link to="/" class="flex items-center">
        <img class="h-12 w-auto" src="../assets/logo.png" alt="Logo" />
        <span class="ml-2 text-white text-xl font-bold">Hệ thống kiểm soát ra vào</span>
      </router-link>
    </div>

    <div class="ml-auto flex items-center space-x-6">
      <div @click="toggleNotificationPanel" class="relative cursor-pointer">
        <i class="pi pi-bell text-white text-3xl transition-transform duration-300 hover:scale-110"></i>
        <span v-if="unreadCount > 0" class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ unreadCount }}
        </span>
      </div>

<div 
  v-if="showNotificationPanel" 
  class="absolute top-16 right-10 bg-white shadow-xl rounded-lg w-80 p-4 z-50 border border-gray-300"
>
  <h3 class="font-bold text-lg mb-3 text-gray-800">🔔 Thông báo mới</h3>
  
  <ul class="max-h-60 overflow-auto">
    <li 
      v-for="(notification, index) in notifications" 
      :key="index" 
      class="border-b border-gray-200 p-3 text-gray-900 font-medium hover:bg-blue-100 cursor-pointer transition duration-200"
    >
      {{ notification.message }}
    </li>
  </ul>

  <div v-if="notifications.length === 0" class="text-center text-gray-600 font-semibold py-3">
    📭 Không có thông báo nào
  </div>
</div>


      <div v-if="user" class="flex items-center space-x-2">
        <i class="pi pi-user text-white text-3xl"></i>
        <span class="text-white font-bold">{{ user.username }}</span>
      </div>

      <button v-if="user" @click="logout" class="text-blue-800 bg-white px-4 py-2 rounded hover:font-bold hover:shadow-lg transition duration-300">Đăng xuất</button>
      <router-link v-if="!user" to="/guest/login" class="text-blue-800 bg-white px-4 py-2 rounded hover:font-bold hover:shadow-lg transition duration-300">Đăng nhập</router-link>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { getNotificationsByUserId } from "../services/SignalR/notificationService";
import { startSignalR, onNotificationReceived } from "../services/SignalR/SignalRService";

export default {
  setup() {
    const store = useStore();
    const showNotificationPanel = ref(false);
    const notifications = ref([]);

    const user = computed(() => store.state.currentUser);
    const userId = computed(() => user.value?.userId || null);

    const unreadCount = computed(() => notifications.value.length);

    onMounted(async () => {
      if (userId.value) {
        try {
          var response = await getNotificationsByUserId(userId.value);
          notifications.value = response.data;
        } catch (error) {
          console.error("Lỗi khi lấy danh sách thông báo:", error);
        }
      }

      await startSignalR();

      onNotificationReceived((message) => {
        notifications.value.unshift({ message });
      });
    });

    const toggleNotificationPanel = () => {
      showNotificationPanel.value = !showNotificationPanel.value;
    };

    const logout = () => {
      store.dispatch("logout");
    };

    return {
      user,
      showNotificationPanel,
      notifications,
      unreadCount,
      toggleNotificationPanel,
      logout,
    };
  },
};
</script> -->
<template>
  <nav class="flex items-center justify-between bg-white p-10 shadow-md">
    <!-- Logo Section -->
    <div class="flex items-center">
      <router-link to="/" class="flex items-center">
        <img class="h-12 w-auto" src="../assets/logoaccess.png" alt="Logo" />
        <span class="ml-2 text-blue-500 text-3xl font-bold">Hệ thống kiểm soát ra vào</span>
      </router-link>
    </div>

    <!-- Right Side Links -->
    <div class="flex items-center space-x-6">
      <!-- Navigation Links (Moved from Sidebar) -->
      <div v-if="user" class="flex space-x-4">
        <template v-if="user.role === 'Admin'">
          <router-link 
            to="/admin/user" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-600 font-semibold': isActive('/admin/user') }"
          >
            Quản lý người dùng
          </router-link>
          <router-link 
            to="/admin/access-request" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-700 font-semibold': isActive('/admin/access-request') }"
          >
            Quản lý yêu cầu ra vào
          </router-link>
          <router-link 
            to="/admin/access-log" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-700 font-semibold': isActive('/admin/access-log') }"
          >
            Quản lý lịch sử ra vào
          </router-link>
          <router-link 
            to="/admin/report" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-700 font-semibold': isActive('/admin/report') }"
          >
            Báo cáo ra vào
          </router-link>
        </template>
        <template v-if="user.role === 'Guest'">
          <router-link 
            to="/guest/my-log" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-700 font-semibold': isActive('/guest/my-log') }"
          >
            Lịch sử ra vào
          </router-link>
          <router-link 
            to="/guest/my-access-request" 
            class="text-blue-400 hover:text-blue-600 transition-colors duration-300 text-xl focus:border-b-2 focus:border-blue-400"
            :class="{ 'text-blue-700 font-semibold': isActive('/guest/my-access-request') }"
          >
            Lịch sử yêu cầu
          </router-link>
        </template>
      </div>

      <!-- Notification Icon -->
      <div @click="toggleNotificationPanel" class="relative cursor-pointer">
        <i class="pi pi-bell text-gray-600 text-2xl transition-transform duration-300 hover:scale-120"></i>
        <span v-if="unreadCount > 0" class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ unreadCount }}
        </span>
      </div>

      <!-- Notification Panel -->
      <div 
        v-if="showNotificationPanel" 
        class="absolute top-16 right-10 bg-white shadow-xl rounded-lg w-80 p-4 z-50 border border-gray-200"
      >
        <h3 class="font-bold text-lg mb-3 text-gray-800">🔔 Thông báo mới</h3>
        <ul class="max-h-60 overflow-auto">
          <li 
            v-for="(notification, index) in notifications" 
            :key="index" 
            class="border-b border-gray-200 p-3 text-gray-900 font-medium hover:bg-blue-100 cursor-pointer transition duration-200"
          >
            {{ notification.message }}
          </li>
        </ul>
        <div v-if="notifications.length === 0" class="text-center text-gray-600 font-semibold py-3">
          📭 Không có thông báo nào
        </div>
      </div>

      <!-- User Info -->
      <div v-if="user" class="flex items-center space-x-2">
        <span class="text-gray-600 font-medium">{{ user.username }}</span>
        <i class="pi pi-user text-blue-600 text-2xl"></i>
      </div>

      <!-- Logout / Login -->
      <router-link v-if="!user" to="/guest/login" class="text-blue-600 font-medium text-2xl">Đăng nhập</router-link>
      <button v-if="user" @click="logout" class="text-blue-600 font-medium text-2xl">Đăng xuất</button>
    </div>
  </nav>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { getNotificationsByUserId } from "../services/SignalR/notificationService";
import { startSignalR, onNotificationReceived } from "../services/SignalR/SignalRService";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const showNotificationPanel = ref(false);
    const notifications = ref([]);

    const user = computed(() => store.state.currentUser);
    const userId = computed(() => user.value?.userId || null);

    const unreadCount = computed(() => notifications.value.length);

    onMounted(async () => {
      if (userId.value) {
        try {
          var response = await getNotificationsByUserId(userId.value);
          notifications.value = response.data;
        } catch (error) {
          console.error("Lỗi khi lấy danh sách thông báo:", error);
        }
      }

      await startSignalR();

      onNotificationReceived((message) => {
        notifications.value.unshift({ message });
      });
    });

    const toggleNotificationPanel = () => {
      showNotificationPanel.value = !showNotificationPanel.value;
    };

    const logout = () => {
      store.dispatch("logout");
    };

    const isActive = (path) => {
      return route.path === path;
    };

    return {
      user,
      showNotificationPanel,
      notifications,
      unreadCount,
      toggleNotificationPanel,
      logout,
      isActive,
    };
  },
};
</script>
<style scoped>
nav {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-600:hover {
  color: #2563eb;
}

.rounded-lg {
  border-radius: 0.5rem;
}
</style>