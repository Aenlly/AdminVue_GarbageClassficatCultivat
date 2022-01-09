import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element.js'
import './assets/css/global.css'
import installElementPlusIcos from './components/ico.js'
import axios from 'axios'
import { ElMessage, ElMessageBox } from "element-plus";

axios.defaults.baseURL = 'http://localhost:8003/api/'

/**
 * 添加请求头
 */
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

const app = createApp(App)
//3.0中使用该语句定义全局
app.config.globalProperties.axios = axios
//消息提示
app.config.globalProperties.$message = ElMessage
//消息提示弹出框
app.config.globalProperties.$messageBox = ElMessageBox

installElementPlus(app)
installElementPlusIcos(app)
app.use(router).mount('#app')
