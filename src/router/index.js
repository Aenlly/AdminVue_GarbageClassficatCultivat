import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Statistics from '../views/Statistics.vue'
import UserList from '../views/user/userList.vue'
import IndexVideo from '../views/index/IndexVideo.vue'
import IndexCarousel from '../views/index/IndexCarousel.vue'
import IndexGarbageType from '../views/index/IndexGarbageType.vue'
import IndexGarbageList from '../views/index/IndexGarbageList.vue'
import GiftManage from '../views/gift/GiftManage.vue'
import GiftOrders from '../views/gift/GiftOrders.vue'

import SearchRecord from '../views/search/SearchRecord.vue'
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
    meta: {
      title: '首页',
    },
    children: [
      {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
        meta: {
          title: '数据信息统计'
        }
      },
      {
        path: '/userList',
        name: 'UserList',
        component: UserList,
        meta: {
          title: '用户信息列表'
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
        path: '/indexGarbageType',
        name: 'IndexGarbageType',
        component: IndexGarbageType,
        meta: {
          title: '垃圾类型管理'
        }
      },
      {
        path: '/indexGarbageList',
        name: 'IndexGarbageList',
        component: IndexGarbageList,
        meta: {
          title: '垃圾类型数据列表'
        },
      },
      {
        path: '/giftManage',
        name: 'GiftManage',
        component: GiftManage,
        meta: {
          title: '礼品信息管理'
        },
      },
      {
        path: '/giftOrders',
        name: 'GiftOrders',
        component: GiftOrders,
        meta: {
          title: '订单信息管理'
        },
      },

      {
        path: '/searchRecord',
        name: 'SearchRecord',
        component: SearchRecord,
        meta: {
          title: '用户搜索记录'
        },
      }

    ],
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
