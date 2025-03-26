import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import ManageUser from '../pages/User/ManageUser.vue' 
import Home from '../pages/Home.vue'
import MyLog from '../pages/Guest/MyLog.vue'
import LoginEmployee from '../components/LoginEmployee.vue'
import AccessRequestManagement from '../pages/Admin/AccessRequestManagement.vue'
import MyRequest from '../pages/Guest/MyRequest.vue'

import { createRouter, createWebHistory } from 'vue-router';
import HomeLayout from '../layouts/HomeLayout.vue';
import ManagementLayout from '../layouts/ManagementLayout.vue';
import Report from '../pages/Admin/Report.vue'
import AccessLog from '../pages/Admin/AccessLog.vue'
const routes = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'employee/login',
        name: 'LoginEmployee',
        component: LoginEmployee
      },
      {
        path: 'guest/login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
    ]
  },
  {
    path: '/guest',
    component: ManagementLayout,
    children: [
      {
        path: 'my-log',
        name: 'MyLog',
        component: MyLog
      },
      {
        path: 'my-access-request',
        name: 'MyRequest',
        component: MyRequest
      },
    ]
  },
  {
    path: '/admin',
    component: ManagementLayout,
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: ManageUser
      },
      {
        path: 'access-request',
        name: 'AccessRequestManagement',
        component: AccessRequestManagement
      },
      {
        path: 'access-log',
        name: 'AccessLog',
        component: AccessLog
      },
      {
        path: 'report',
        name: 'Report',
        component: Report
      },

    ]
  },
  {
    path: '/employee',
    component: ManagementLayout,
    children: [
      {
        path: 'my-log',
        name: 'Mylog',
        component: MyLog
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

