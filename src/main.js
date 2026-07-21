import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import router from './router'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'

const AcademicNavyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef2ff',
      100: '#d8e2ff',
      200: '#c7d7fd',
      300: '#afc6fb',
      400: '#8299cb',
      500: '#16305c', // --color-primary (Base brand color)
      600: '#112649',
      700: '#0d1d37',
      800: '#081426',
      900: '#040b16',
      950: '#001b42', // --color-primary-dark
    },
    colorScheme: {
      light: {
        primary: {
          color: '#16305c',         // --color-primary
          hoverColor: '#0a2350',    
          activeColor: '#001b42',   // --color-primary-dark
          contrastColor: '#ffffff',
        },
        surface: {
          0: '#ffffff',             // --color-surface-card
          50: '#faf9fd',            // --color-surface
          100: '#efedf2',           // --color-surface-container
          200: '#e4e2e9',
          300: '#d9d7de',
          400: '#c4c6d0',           // --color-outline-variant
          500: '#a3a5af',
          600: '#747780',           // --color-outline
          700: '#44474f',           // --color-on-surface-variant
          800: '#2e3036',
          900: '#1a1b1f',           // --color-on-surface
          950: '#0f1013',
        },
        formField: {
          borderColor: '{surface.400}',      
          hoverBorderColor: '{surface.600}',
          focusBorderColor: '#16305c',       
        },
      },
    },
  },
  components: {
    button: {
      borderRadius: '0.25rem', 
    },
    card: {
      borderRadius: '0.5rem',  
    },
    dialog: {
      borderRadius: '0.5rem',
    },
    checkbox: {
      borderRadius: '0.25rem',
    },
    inputtext: {
      borderRadius: '0.25rem',
    },
    badge: {
      borderRadius: '0.25rem',
    }
  }
})

const app = createApp(App)
app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEVUE_API_KEY,
  theme: {
    preset: AcademicNavyPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
      darkModeSelector: 'none',
    },
  },
})
app.use(createPinia())
app.use(router)
app.mount('#app')
