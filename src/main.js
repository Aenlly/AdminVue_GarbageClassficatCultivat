import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element.js'
import './assets/css/global.css'
import installElementPlusIcos from './components/ico.js'
import axios from 'axios'
import { ElMessage } from "element-plus";

axios.defaults.baseURL = 'http://localhost:8003/api/'

const app = createApp(App)
//3.0中使用该语句定义全局
app.config.globalProperties.axios = axios
app.config.globalProperties.$message = ElMessage

installElementPlus(app)
installElementPlusIcos(app)
app.use(router).mount('#app')
