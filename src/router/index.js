import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Statistics from '../views/Statistics.vue'
import User from '../views/User.vue'
import IndexVideo from '../views/index/IndexVideo.vue'
import IndexCarousel from '../views/index/IndexCarousel.vue'
import IndexGarbage from '../views/index/IndexGarbage.vue'
import { ElMessage } from "element-plus";

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: "/index",
    meta: {
      title: '首页',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录页面',
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
        meta: {
          title: '数据统计'
        }
      },
      {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
          title: '用户列表'
        }
      }, {
        path: '/indexVideo',
        name: 'IndexVideo',
        component: IndexVideo,
        meta: {
          title: '宣传视频管理'
        }
      }, {
        path: '/indexCarousel',
        name: 'IndexCarousel',
        component: IndexCarousel,
        meta: {
          title: '轮播信息管理'
        }
      }, {
        path: '/indexGarbage',
        name: 'IndexGarbage',
        component: IndexGarbage,
        meta: {
          title: '垃圾信息管理'
        }
      }
    ],
    meta: {
      title: '首页',
    }
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
//路由导航守卫，to代表访问路径，from代表从那个路径跳转过来，next函数用于放行
router.beforeEach((to, from, next) => {

  document.title = to.meta.title
  //获取token，用于判断是否登录
  const tokenStr = window.sessionStorage.getItem('token')

  // if (to.path === '/login') {
  //   //存在token则跳转至首页
  //   if (tokenStr) {
  //     return next("/index")
  //   }
  //   return next()
  // }
  // if (!tokenStr) {
  //   // 提示
  //   ElMessage.warning("请先登录!")
  //   //强制跳转至登录页
  //   next('/login')
  // }
  //放行
  next()
})

export default router
