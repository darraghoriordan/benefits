<template>
    <div>
        <h3 class="title comparison-section__section-title">{{ comparisonTable.name }}</h3>
        <table class="table is-bordered is-striped is-narrow">
            <tbody>
                <tr v-for="field in comparisonTable.fields">
                    <td>
                        {{ field.name }}
                    </td>
                    <td>
                        {{ field.valueX }}
                    </td>
                    <td>
                        {{ field.valueY }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  name: 'ComparisonSection',
  methods: {
    calcualteDisplayValue: function(prop) {
      if (!prop) {
        return 'Unknown'
      }
      if (prop.type === 'bool') {
        if (prop.value === 'true') {
          return 'Yes'
        }
        return 'No'
      }
      if (prop.type === 'fixedAmount') {
        return '$' + prop.value
      }
      if (prop.type === 'percent') {
        return prop.value + '%'
      }

      return prop.value
    },
    getFields: function(companyObjectX, companyObjectY, categoryName) {
      let fieldList = []
      if (companyObjectX) {
        for (var prop in companyObjectX[categoryName]) {
          let currentXProp = companyObjectX[categoryName][prop]
          let newCombinedProp = {}
          newCombinedProp.name = currentXProp.name
          newCombinedProp.valueX = this.calcualteDisplayValue(currentXProp)
          newCombinedProp.valueY = 'Unknown'
          if (companyObjectY && companyObjectY[categoryName]) {
            let currentYProp = companyObjectY[categoryName].find(
              x => x.name === currentXProp.name
            )
            if (currentYProp) {
              newCombinedProp.valueY = this.calcualteDisplayValue(currentYProp)
            }
          }
          fieldList.push(newCombinedProp)
        }
      }

      if (companyObjectY) {
        for (var yprop in companyObjectY[categoryName]) {
          let currentYProp = companyObjectY[categoryName][yprop]
          let currentXProp = null
          if (companyObjectX) {
            let currentXCategory = companyObjectX[categoryName]
            if (currentXCategory) {
              currentXProp = companyObjectX[categoryName].find(
                x => x.name === currentYProp.name
              )
            }
          }
          if (!currentXProp) {
            let newCombinedProp = {}
            newCombinedProp.name = currentYProp.name
            newCombinedProp.valueY = this.calcualteDisplayValue(currentYProp)
            newCombinedProp.valueX = 'Unknown'

            fieldList.push(newCombinedProp)
          }
        }
      }

      return fieldList
    }
  },
  props: {
    categoryName: '',
    leftCompany: {},
    rightCompany: {}
  },
  computed: {
    comparisonTable: function() {
      let category = {}
      category.name = this.categoryName
      category.fields = this.getFields(
        this.leftCompany,
        this.rightCompany,
        this.categoryName
      )
      return category
    }
  }
}
</script>

<style>
.comparison-section__section-title {
  text-transform: capitalize;
}
</style>