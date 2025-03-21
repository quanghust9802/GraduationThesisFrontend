import { createStore } from 'vuex';
import {jwtDecode} from 'jwt-decode'; // Adjust the import if needed
import router from '../router/index.js';

const store = createStore({
  state: {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,  
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    }
  },
  actions: {
    async login({ commit }, token) {
      try {
        console.log("Into login method");
        const decodedToken = jwtDecode(token);

        const userID = decodedToken.UserId;
        const username = decodedToken.Username;
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        const user = {
          name: username,
          userId: userID,
          role: role
        };

        commit('setCurrentUser', user);
        commit('setToken', token);

        console.log("User logged in successfully");
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    },

    async logout({ commit }) {
      try {
        commit('setCurrentUser', null);
        commit('setToken', null);

        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');

        await router.push('/');
        console.log("User logged out successfully");
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.currentUser,
  },
});

export default store;

