import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes'
import router from './router';
import { createPinia } from 'pinia';
const AcademicNavyPreset = definePreset(Aura, {
    semantic: {
      primary: {
        50: '#eef2ff',
        100: '#d8e2ff',
        200: '#c7d7fd',
        300: '#afc6fb',
        400: '#8299cb',
        500: '#6178a8',
        600: '#475e8d',
        700: '#2e4673',
        800: '#16305c',
        900: '#0a2350',
        950: '#001b42'
      },
      colorScheme: {
        light: {
          surface: {
            0: '#ffffff',
            50: '#faf9fd',
            100: '#f4f3f7',
            200: '#efedf2',
            300: '#e9e7ec',
            400: '#e3e2e6',
            500: '#c4c6d0',
            600: '#747780',
            700: '#44474f',
            800: '#2f3034',
            900: '#1a1b1f',
            950: '#0f0f11'
          }
        }
      }
    }
})

const app = createApp(App);
app.use(PrimeVue, {
    license: import.meta.env.VITE_PRIMEVUE_API_KEY,
    theme: {
        preset: AcademicNavyPreset,
        options:{
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue'
            },
            darkModeSelector: 'none', 
        }
    },
});
app.use(createPinia())
app.use(router)
app.mount('#app')

