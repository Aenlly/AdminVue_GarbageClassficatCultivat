import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element.js'
//全局样式
import './assets/css/global.css'
//引入第三方图标
import './assets/icon/iconfont.css'
//element断点隐藏样式
import installElementPlusIcos from './components/ico.js'
import axios from 'axios'


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

app.config.globalProperties.$httpResource = "http://localhost:8004"

installElementPlus(app)
installElementPlusIcos(app)
app.use(router).mount('#app')
