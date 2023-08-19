import Vue from 'vue'
import VueRouter from 'vue-router'

// 一级路由
import Layout from '@/views/layout'
// 二级路由
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'

const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list')
const ProDetail = () => import('@/views/prodetail')
const Login = () => import('@/views/login')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder')

Vue.use(VueRouter)
// 路由配置
const routes = [
  {
    path: '/login',
    component: Login // 注意跟import时同名
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home', // 路由重定向
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'category',
        component: Category
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/searchlist',
    component: SearchList
  },
  {
    // 动态路由传参，确认将来是哪个商品，路由参数中携带 id
    path: '/prodetail/:id',
    component: ProDetail
  },
  {
    path: '/pay',
    component: Pay
  },
  {
    path: '/myorder',
    component: MyOrder
  }
]

const router = new VueRouter({
  routes
})

const authUrl = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  const token = store.getters.token
  if (!authUrl.includes(to.path)) {
    next()
    return
  }

  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
