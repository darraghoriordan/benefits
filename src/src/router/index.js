import Vue from 'vue'
import Router from 'vue-router'
import CalculatorPage from '@/components/CalculatorPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CalculatorPage',
      component: CalculatorPage
    }
  ]
})
