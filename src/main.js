import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import Toast from 'primevue/toast';
import "./assets/main.css";

//import PrimeVue from 'primevue/config';
//import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';


const app = createApp(App);
/*
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
// THIS IS IMPORTANT
app.component('Toast', Toast);
*/
window.vm = app.mount("#app");
