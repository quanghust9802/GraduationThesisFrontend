  <!-- <template>
    <div class="flex flex-col h-screen bg-gray-100">
      <Navbar 
        v-if="isLoggedIn" 
        PathHome='/admin/user' 
        class="w-full fixed top-0 left-0 z-10 bg-blue-600 text-white shadow-lg"
      />
  
      <div class="flex flex-1 mt-2 mx-4 overflow-hidden">
        <nav 
          v-if="isLoggedIn" 
          class="w-64 bg-white p-6 rounded-lg shadow-lg mr-4 mt-4"
        >
          <h2 v-if="role === 'Admin'" class="font-bold text-2xl text-blue-600 mb-4">Trang quản lý</h2>
          <h2 v-if="role === 'Guest'" class="font-bold text-2xl text-blue-600 mb-4">Trang khách </h2>
          <ul class="space-y-2">
            <template v-if="role === 'Admin'">
              <li>
                <router-link 
                  to="/admin/user" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/admin/user') }"
                >
                  Quản lý người dùng
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/admin/access-request" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/admin/access-request') }"
                >
                  Quản lý yêu cầu ra vào
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/admin/access-log" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/admin/access-log') }"
                >
                  Quản lý lịch sử ra vào
                </router-link>
              </li>
            </template>
          </ul>
  
          <h2 v-if="role === 'Admin'" class="font-bold text-2xl text-blue-600 mt-6 mb-4">Báo cáo</h2>
          
          <ul class="space-y-2">
            <template v-if="role === 'Admin'">
              <li>
                <router-link 
                  to="/admin/report" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/admin/report') }"
                >
                  Báo cáo ra vào
                </router-link>
              </li>
            </template>
            <template v-if="role === 'Guest'">
              <li>
                <router-link 
                  to="/guest" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/guest/my-log') }"
                >
                  Lịch sử ra vào 
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/guest/my-access-request" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/guest/my-access-request') }"
                >
                  Lịch sử yêu cầu
                </router-link>
              </li>
            </template>
          </ul>
        </nav>
  
        <main class="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-auto mt-4">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import { mapState } from 'vuex';
  
  export default {
    components: {
      Navbar
    },
    computed: {
      ...mapState(['currentUser']),
      role() {
        console.log("current User role: " + this.currentUser.role);
        return this.currentUser ? this.currentUser.role : '';
      },
      isLoggedIn() {
        return !!this.currentUser; 
      }
    },
    methods: {
      isActive(route) {
        return this.$route.path === route; 
      }
    }
  }
  </script>
  
  <style>
  </style>
   -->

   <template>
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Navbar -->
      <Navbar 
        v-if="isLoggedIn" 
        class="w-full fixed top-0 left-0 z-10"
      />
  
      <main class="flex-1 mt-16 px-2 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- <h1 class="text-3xl font-bold text-gray-600 mb-4 border-b-2 border-gray-100 pb-2 mt-10">
            {{ role === 'Admin' ? 'Trang quản lý' : 'Trang khách' }}
          </h1>
  
          <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md mb-8">
            <div class="flex-1">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                v-model="searchQuery"
              />
            </div>
            <button class="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Tìm kiếm</button>
          </div> -->
  
          <div class="bg-white rounded-lg shadow-md p-6 m-10">
            <router-view :searchQuery="searchQuery" />
          </div>
        </div>
      </main>
    </div>
  </template>
  <script>
  import Navbar from '../components/Navbar.vue';
  import { mapState } from 'vuex';
  import { ref } from 'vue';
  
  export default {
    components: {
      Navbar
    },
    setup() {
      const searchQuery = ref('');
  
      return {
        searchQuery,
      };
    },
    computed: {
      ...mapState(['currentUser']),
      role() {
        console.log("current User role: " + this.currentUser.role);
        return this.currentUser ? this.currentUser.role : '';
      },
      isLoggedIn() {
        return !!this.currentUser;
      }
    }
  };
  </script>
  <style scoped>
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  
  .text-blue-600 {
    color: #2563eb;
  }
  
  .bg-blue-600 {
    background-color: #2563eb;
  }
  
  .bg-blue-600:hover {
    background-color: #1d4ed8;
  }
  
  .border-blue-600 {
    border-color: #2563eb;
  }
  
  .text-gray-600 {
    color: #4b5563;
  }
  
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  </style>