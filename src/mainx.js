// import Vue from 'vue'

// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// import '@/styles/index.scss' // global css

// import App from './App'
// import store from './store'
// import router from './router'

// import '@/icons' // icon
// import '@/permission' // permission control

// /**
//  * If you don't want to use mock-server
//  * you want to use MockJs for mock api
//  * you can execute: mockXHR()
//  *
//  * Currently MockJs will be used in the production environment,
//  * please remove it before going online ! ! !
//  */
// // if (process.env.NODE_ENV === 'production') {
// //   const { mockXHR } = require('../mock')
// //   mockXHR()
// // }
// import AsyncComputed from 'vue-async-computed'

// Vue.use(AsyncComputed)
// // set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// // 如果想要中文版 element-ui，按如下方式声明
// // Vue.use(ElementUI)

// Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })


import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store/index'
import AsyncComputed from 'vue-async-computed'

// ElementUI Theme
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//import './element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'

 import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// Tailwind
import '@/assets/tailwind.min.css'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { APP_CONSUMED_ICONS } from './utils/fontawesome-library'

library.add(...APP_CONSUMED_ICONS)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Async Computed

Vue.use(ElementUI, { locale })
Vue.use(AsyncComputed)

// HighCharts Installation
 import Highcharts from 'highcharts'
// import highchartsMore from 'highcharts/highcharts-more'
//import highchartsSolidGauge from 'highcharts/modules/solid-gauge'
 import HighchartsVue from 'highcharts-vue'

// highchartsMore(Highcharts)
// highchartsSolidGauge(Highcharts) 
Vue.use(HighchartsVue, {
   Highcharts
 })

// Vue.use(Highcharts)

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app')


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// import Vue from 'vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import App from './App.vue'

// Vue.use(ElementUI)

// new Vue({
//   el: '#app',
//      store,
//      router,
//   render: h => h(App)
// })
