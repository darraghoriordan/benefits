<template>
    <div>       
      <ComparisonSection :left-company="leftCompany" :right-company="rightCompany" category-name="benefits"></ComparisonSection>
      <ComparisonSection :left-company="leftCompany" :right-company="rightCompany" category-name="technology"></ComparisonSection>
      <ComparisonSection :left-company="leftCompany" :right-company="rightCompany" category-name="perks"></ComparisonSection>
    </div>
</template>

<script>
import ComparisonSection from './ComparisonSection'

export default {
  name: 'ComparisonGrid',
  components: { ComparisonSection },
  computed: {
    getCategoryNameCollection: function() {
      let categoryNameCollection = []
      let companyX = this.leftCompany
      let companyY = this.rightCompany
      for (var key in companyX) {
        if (!companyX.hasOwnProperty(key)) {
          continue
        }
        categoryNameCollection.push(key)
      }
      for (var ykey in companyY) {
        if (!companyY.hasOwnProperty(ykey)) {
          continue
        }
        if (
          categoryNameCollection.find(function(element) {
            return element === ykey
          })
        ) {
          continue
        }
        categoryNameCollection.push(ykey)
      }

      return categoryNameCollection
    }
  },
  props: {
    leftCompany: {},
    rightCompany: {}
  }
}
</script>