import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/system/LoginPage.vue'),
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('../views/system/LoginPage.vue'),
    },
    {
      path: '/regist',
      name: '注册',
      component: () => import('../views/system/RegistPage.vue'),
    },
    {
      path: '/system',
      name: '房屋出租系统',
      component: () => import('../layout/LayOut.vue'),
      children: [
        {
          path: 'index',
          name: '首页',
          component: () => import('../views/system/IndexPage.vue'),
        },
        {
          path: 'userCenter',
          name: '个人中心',
          component: () => import('../components/UserCenter.vue'),
        },
        {
          path: 'admin',
          name: '管理员',
          children: [
            {
              path: 'user',
              name: '用户管理',
              component: () => import('../views/admin/UserPage.vue'),
            },
            {
              path: 'house',
              name: '房源审核',
              component: () => import('../views/admin/HousePage.vue'),
            },
            {
              path: 'order',
              name: '订单管理',
              component: () => import('../views/admin/OrderPage.vue'),
            },
            {
              path: 'report',
              name: '举报管理',
              component: () => import('../views/admin/ReportPage.vue'),
            },
            {
              path: 'reservation',
              name: '预约管理',
              component: () => import('../views/admin/ReservationPage.vue'),
            },
          ],
        },
        {
          path: 'houser',
          name: '房东',
          children: [
            {
              path: 'house',
              name: '我的房源',
              component: () => import('../views/houser/HousePage.vue'),
            },
            {
              path: 'order',
              name: '我的订单',
              component: () => import('../views/houser/OrderPage.vue'),
            },

            {
              path: 'reservation',
              name: '预约通知',
              component: () => import('../views/houser/ReservationPage.vue'),
            },
          ],
        },
        {
          path: 'renter',
          name: '租客',
          children: [
            {
              path: 'house',
              name: '搜索房源',
              component: () => import('../views/renter/HousePage.vue'),
            },
            {
              path: 'collect',
              name: '我的收藏',
              component: () => import('../views/renter/CollectPage.vue'),
            },
            {
              path: 'order',
              name: '订单状态',
              component: () => import('../views/renter/OrderPage.vue'),
            },
            {
              path: 'reservation',
              name: '预约看房',
              component: () => import('../views/renter/ReservationPage.vue'),
            },
            {
              path: 'report',
              name: '我的举报',
              component: () => import('../views/renter/ReportPage.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
