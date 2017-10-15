import Vue from 'vue'
import Router from 'vue-router'
import CalculatorPage from '@/components/CalculatorPage'
import AboutPage from '@/components/AboutPage'
import OfferComparePage from '@/components/OfferComparePage'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/calc',
      name: 'CalculatorPage',
      component: CalculatorPage
    },
    {
      path: '/',
      name: 'OfferComparePage',
      component: OfferComparePage
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: AboutPage
    }
  ]
})
