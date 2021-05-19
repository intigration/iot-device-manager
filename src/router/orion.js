
import store from '@/store/index'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Authenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const UnAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}



export default new Router ({

orionRoutes : [
        {
          path: '/login',
          name: 'user-login-yarn page',
          component: () => import('@/containers/UserLoginPage').default,
          beforeEnter: UnAuthenticated
        },
        {
          path: '/',
          name: 'devices-and-ports-listing-page',
          component: () => import('@/containers/DeviceListingPage').default,
          beforeEnter: Authenticated
        },
        {
          path: '/connection',
          name: 'device-connection-page',
          component: () => import('@/containers/DeviceConnectionPage').default,
          beforeEnter: Authenticated
        },
        {
          path: '/mote/setup_home',
          name: 'mote-setup-home-page',
          component: () => import('@/containers/mote/MoteSetupHomePage').default,
          beforeEnter: Authenticated
        },
        {
          path: '/gateway/setup_home',
          name: 'gateway-setup-home-page',
          component: () => import('@/containers/gateway/GatewaySetupHomePage').default,
          beforeEnter: Authenticated
        },
        {
          path: '*',
          redirect: '/'
        }
  ]
})