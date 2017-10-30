<template>
<div>
    <p>Taking the {{offerTitle}} offer would give you...</p>
    <span v-bind:class="classObject" ref="title-container">
        {{ salaryDifference | currency }}
    </span>
    <p>Because...</p>
    <WeightGraph :values="salaryComponentDifference" :totalDifference="salaryDifference"></WeightGraph>
</div>
</template>

<script>
import WeightGraph from './WeightGraph'
export default {
  name: 'DifferenceResult',
  components: { WeightGraph },
  props: {
    companyOneDataset: {
      type: Array,
      required: true
    },
    companyTwoDataset: {
      type: Array,
      required: true
    },
    offerTitle: {
      type: String,
      required: true
    }
  },
  filters: {
    currency: function(value) {
      return '$' + value.toFixed(2)
    }
  },
  methods: {
    sumCompanyBaseSalaries: function(companyData) {
      let totalSalary = companyData.reduce(function(sum, next) {
        let newSum = sum + next.salary
        return newSum
      }, 0)
      return totalSalary
    },
    sumCompanyBenefits: function(companyData) {
      let totalBenefits = companyData.reduce(function(sum, next) {
        let benefitsSum = 0
        if (next.benefitsCollection) {
          benefitsSum = next.benefitsCollection.reduce(function(
            accumulator,
            currentValue
          ) {
            return accumulator + currentValue.value
          },
          0)
        }
        let newSum = sum + benefitsSum
        return newSum
      }, 0)
      return totalBenefits
    },
    summedBenefitsCollection: function(companyData) {
      let summedBenefitsCollection = []
      companyData.forEach(function(element) {
        element.benefitsCollection.forEach(function(element) {
          let summedBenefit = summedBenefitsCollection.find(function(item) {
            return item.name === element.name
          })

          if (!summedBenefit) {
            summedBenefit = {
              name: element.name,
              value: 0
            }
            summedBenefitsCollection.push(summedBenefit)
          }
          if (element.value) {
            summedBenefit.value += element.value
          }
        }, this)
      }, this)
      return summedBenefitsCollection
    }
  },
  computed: {
    salaryComponentDifference: function() {
      let differenceSet = []
      let companyOneSummedBenefitsCollection = this.summedBenefitsCollection(
        this.companyOneDataset
      )
      let companyTwoSummedBenefitsCollection = this.summedBenefitsCollection(
        this.companyTwoDataset
      )

      companyOneSummedBenefitsCollection.forEach(function(companyOneElement) {
        let companyTwoElement = companyTwoSummedBenefitsCollection.find(
          function(item) {
            return item.name === companyOneElement.name
          }
        )
        let diffdElement = {
          name: companyOneElement.name,
          value: companyOneElement.value
        }
        if (companyTwoElement) {
          diffdElement.value = companyTwoElement.value - companyOneElement.value
        } else {
          diffdElement.value = 0 - companyOneElement.value
        }
        differenceSet.push(diffdElement)
      }, this)
      companyTwoSummedBenefitsCollection.forEach(function(companyTwoElement) {
        let diffedElement = differenceSet.find(function(item) {
          return item.name === companyTwoElement.name
        })

        if (!diffedElement) {
          differenceSet.push({
            name: companyTwoElement.name,
            value: companyTwoElement.value
          })
        }
      }, this)
      // and add the base salary difference
      differenceSet.push({
        name: 'Base Salary',
        value:
          this.sumCompanyBaseSalaries(this.companyTwoDataset) -
          this.sumCompanyBaseSalaries(this.companyOneDataset)
      })
      return differenceSet
    },
    salaryDifference: function() {
      let companyOneSalaryTotal = 0
      if (this.companyOneDataset && this.companyOneDataset.length > 0) {
        let companyOneBaseSalaries = this.sumCompanyBaseSalaries(
          this.companyOneDataset
        )
        let companyOneBenefits = this.sumCompanyBenefits(this.companyOneDataset)
        companyOneSalaryTotal = companyOneBaseSalaries + companyOneBenefits
      }
      let companyTwoSalaryTotal = 0
      if (this.companyTwoDataset && this.companyTwoDataset.length > 0) {
        let companyTwoBaseSalaries = this.sumCompanyBaseSalaries(
          this.companyTwoDataset
        )
        let companyTwoBenefits = this.sumCompanyBenefits(this.companyTwoDataset)
        companyTwoSalaryTotal = companyTwoBaseSalaries + companyTwoBenefits
      }
      return companyTwoSalaryTotal - companyOneSalaryTotal
    },
    classObject: function() {
      return {
        'title is-2 difference-result__total-salary': true,
        'negative-number': this.salaryDifference < 0,
        'positive-number': this.salaryDifference > 0
      }
    }
  }
}
</script>

<style scoped>
.difference-result__total-salary {
  font-size: 3em;
}

.positive-number {
  color: green;
}

.negative-number {
  color: red;
}
</style>
        