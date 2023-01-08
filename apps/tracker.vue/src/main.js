// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-card.css'
import 'element-plus/theme-chalk/el-row.css'
import 'element-plus/theme-chalk/el-col.css'
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/el-tree.css'
import 'element-plus/theme-chalk/el-popover.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-table.css'
import 'element-plus/theme-chalk/el-table-column.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-checkbox-group.css'
// import 'element-plus/theme-chalk/el-select.css'
// import 'element-plus/theme-chalk/el-option.css'
import '@nado/nado-vue-ui/src/styles/fonts/fonts.css'
import '@nado/nado-vue-ui/src/styles/styles.css'
import './style.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
