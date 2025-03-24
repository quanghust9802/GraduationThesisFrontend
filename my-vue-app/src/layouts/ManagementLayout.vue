  <template>
    <div class="flex flex-col h-screen bg-gray-100">
      <!-- Navbar at the top -->
      <Navbar 
        v-if="isLoggedIn" 
        PathHome='/admin/users' 
        class="w-full fixed top-0 left-0 z-10 bg-blue-600 text-white shadow-lg"
      />
  
      <div class="flex flex-1 mt-24 mx-4 overflow-hidden">
        <!-- Sidebar navigation -->
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
              <!-- <li>
                <router-link 
                  to="/admin/report2" 
                  class="block py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  :class="{ 'bg-blue-200 text-blue-700': isActive('/admin/report2') }"
                >
                  Báo cáo bất thường
                </router-link>
              </li> -->
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
  
        <!-- Main content area -->
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
  /* Add any styles for your management layout */
  </style>
  