import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

//import './element-variables.scss'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// ElementUI Theme
import ElementUI from 'element-ui'
import './element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'

// Tailwind
import '@/assets/tailwind.min.css'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { APP_CONSUMED_ICONS } from './utils/fontawesome-library'

library.add(...APP_CONSUMED_ICONS)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Async Computed
import AsyncComputed from 'vue-async-computed'

Vue.use(ElementUI, { locale })
Vue.use(AsyncComputed)

// HighCharts Installation
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import highchartsSolidGauge from 'highcharts/modules/solid-gauge'
import HighchartsVue from 'highcharts-vue'

highchartsMore(Highcharts)
highchartsSolidGauge(Highcharts)
Vue.use(HighchartsVue, {
  Highcharts
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
