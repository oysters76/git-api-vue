import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { createI18n } from 'vue-i18n'

import en from './locales/en';
import fr from './locales/fr';
import ja from './locales/ja';


const i18n = createI18n({
    legacy:false,
    locale: localStorage.getItem("lang") || 'en', // Default language
    fallbackLocale: 'en', // Fallback language
    messages: {
      en,
      fr,
      ja,
    },
});
  

const app = createApp(App)
app.use(createPinia());
app.use(i18n);
app.use(router)
app.mount("#app"); 