

import Layout from '@/layout'
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

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
routes: [
  {
    path: '/login',
    name: 'user-login-yarn page',
    component: require('@/containers/UserLoginPage').default,
    beforeEnter: UnAuthenticated
  },
  {
    path: '/',
    name: 'devices-and-ports-listing-page',
    component: require('@/containers/DeviceListingPage').default,
    beforeEnter: Authenticated
  },
  {
    path: '/connection',
    name: 'device-connection-page',
    component: require('@/containers/DeviceConnectionPage').default,
    beforeEnter: Authenticated
  },
  {
    path: '/mote/setup_home',
    name: 'mote-setup-home-page',
    component: require('@/containers/mote/MoteSetupHomePage').default,
    beforeEnter: Authenticated
  },
  {
    path: '/gateway/setup_home',
    name: 'gateway-setup-home-page',
    component: require('@/containers/gateway/GatewaySetupHomePage').default,
    beforeEnter: Authenticated
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default vizRouter
