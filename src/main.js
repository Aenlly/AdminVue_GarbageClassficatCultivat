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
import Highcahrts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import WangEditor from 'wangeditor';


// axios.defaults.baseURL = 'https://localhost:8003/api/'//本地接口
axios.defaults.baseURL = 'https://www.aenlly.top:8003/api/' //远程接口

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

app.config.globalProperties.$httpResource = "http://www.aenlly.top:8004"

// 进行全局配置
Highcahrts.setOptions({
    credits: {
        href: "https://www.aenlly.top/", //版权连接的地址
        text: "垃圾分类养成", //版权显示的标题
    }
})
installElementPlus(app)
installElementPlusIcos(app)
app.use(HighchartsVue, {
    highcharts: Highcahrts
})
app.use(router).mount('#app')
app.component("v-editor", WangEditor)
