import './styles/fonts/fonts.css'
import './styles/styles.css'
import 'dayjs/locale/ru'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
