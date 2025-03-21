import './assets/tailwind.css'; 
import router from "./router";
import store from "./store";

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css'; 
import 'primevue/resources/primevue.min.css'; 
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ToastService from 'primevue/toastservice';


const app = createApp(App)
  app.use(store)
  app.use(router)
  app.use(PrimeVue)
  app.use(ToastService);
  app.component('Button', Button);
  app.component('InputText', InputText);
  app.component('DataTable', DataTable);
  app.component('Column', Column);
  app.component('Dialog', Dialog);

  app.mount("#app");

