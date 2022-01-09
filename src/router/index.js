import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      state: true
    }
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta: {
      state: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      state: false
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
//路由导航守卫，to代表访问路径，from代表从那个路径跳转过来，next函数用于放行
router.beforeEach((to, from, next) => {
  //获取token，用于判断是否登录
  const tokenStr = window.sessionStorage.getItem('token')

  if (to.path === '/login') {
    //存在token则跳转至首页
    if (tokenStr) {
      return next("/index")
    }
    return next()
  }
  if (!tokenStr) {
    //强制跳转至登录页
    next('/login')
  }
  //放行
  next()
})

export default router
