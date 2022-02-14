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
import QuestionBank from '../views/quiz/QuestionBank.vue'
import SubjectList from '../views/quiz/SubjectList.vue'
import Questionnaire from '../views/quiz/Questionnaire.vue'
import QuestionSheet from '../views/quiz/QuestionSheet.vue'
import HotInfo from '../views/hotInformation/HotInfo.vue'
import HotInfoCheck from '../views/hotInformation/HotInfoCheck.vue'
import HotInfoAdd from '../views/hotInformation/HotInfoAdd.vue'
import HotInfoEdit from '../views/hotInformation/HotInfoEdit.vue'
import WasteTurnTreasure from '../views/wasteTurnTreasure/WasteTurnTreasure.vue'
import WasteTurnTreasureAudit from '../views/wasteTurnTreasure/WasteTurnTreasureAudit.vue'
import IntegralRanking from '../views/integral/IntegralRanking.vue'
import IntegralRecord from '../views/integral/IntegralRecord.vue'
import IntegralTitle from '../views/integral/IntegralTitle.vue'
import SearchLibrary from '../views/search/SearchLibrary.vue'
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
          title: '所属垃圾类型数据列表'
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
        path: '/questionBank',
        name: 'QuestionBank',
        component: QuestionBank,
        meta: {
          title: '题库信息管理'
        },
      },
      {
        path: '/subjectList',
        name: 'SubjectList',
        component: SubjectList,
        meta: {
          title: '题目信息列表'
        },
      },
      {
        path: '/questionnaire',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: {
          title: '问卷信息管理'
        },
      },
      {
        path: '/questionSheet',
        name: 'QuestionSheet',
        component: QuestionSheet,
        meta: {
          title: '答卷信息管理'
        },
      },
      {
        path: '/hotInfo',
        name: 'HotInfo',
        component: HotInfo,
        meta: {
          title: '资讯信息管理'
        },
      },
      {
        path: '/hotInfoCheck',
        name: 'HotInfoCheck',
        component: HotInfoCheck,
        meta: {
          title: '资讯信息详情'
        },
      },
      {
        path: '/hotInfoAdd',
        name: 'HotInfoAdd',
        component: HotInfoAdd,
        meta: {
          title: '新增资讯信息'
        },
      },
      {
        path: '/hotInfoEdit',
        name: 'HotInfoEdit',
        component: HotInfoEdit,
        meta: {
          title: '编辑资讯信息'
        },
      },
      {
        path: '/wasteTurnTreasure',
        name: 'WasteTurnTreasure',
        component: WasteTurnTreasure,
        meta: {
          title: '信息管理'
        },
      },
      {
        path: '/wasteTurnTreasureAudit',
        name: 'WasteTurnTreasureAudit',
        component: WasteTurnTreasureAudit,
        meta: {
          title: '审核管理'
        },
      },
      {
        path: '/integralRanking',
        name: 'IntegralRanking',
        component: IntegralRanking,
        meta: {
          title: '积分排名查看'
        },
      },
      {
        path: '/integralRecord',
        name: 'IntegralRecord',
        component: IntegralRecord,
        meta: {
          title: '积分记录查看'
        },
      },
      {
        path: '/integralTitle',
        name: 'IntegralTitle',
        component: IntegralTitle,
        meta: {
          title: '积分头衔管理'
        },
      },
      {
        path: '/searchLibrary',
        name: 'SearchLibrary',
        component: SearchLibrary,
        meta: {
          title: '搜索信息库'
        },
      },
      {
        path: '/searchRecord',
        name: 'SearchRecord',
        component: SearchRecord,
        meta: {
          title: '用户搜索记录'
        },
      },
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

  if (to.path === '/login') {
    //存在token则跳转至首页
    if (tokenStr) {
      return next("/index")
    }
    return next()
  }
  if (!tokenStr) {
    // 提示
    ElMessage.warning("请先登录!")
    //强制跳转至登录页
    next('/login')
  }
  //放行
  next()
})

export default router
