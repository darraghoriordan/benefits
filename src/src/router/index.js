import Vue from 'vue'
import Router from 'vue-router'
import CalculatorPage from '@/components/CalculatorPage'
import AboutPage from '@/components/AboutPage'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'CalculatorPage',
      component: CalculatorPage
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: AboutPage
    }
  ]
})
