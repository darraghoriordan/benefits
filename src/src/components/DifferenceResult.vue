<template>
    <span v-bind:class="classObject" ref="title-container">
        {{ salaryDifference | currency }}
    </span>
</template>

<script>
export default {
  name: 'DifferenceResult',
  props: {
    companyOneDataset: {
      type: Array,
      required: true
    },
    companyTwoDataset: {
      type: Array,
      required: true
    }
  },
  filters: {
    currency: function(value) {
      return '$' + value.toFixed(2)
    }
  },
  methods: {
    sumBenefits: function(benefitsCollection) {
      let benefitsSum = benefitsCollection.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + currentValue.value
      },
      0)
      return benefitsSum
    },
    sumCompanyData: function(companyData) {
      let localComponent = this
      return companyData.reduce(function(sum, next) {
        let newSum =
          sum +
          (next.salary + localComponent.sumBenefits(next.benefitCollection))
        return newSum
      }, 0)
    }
  },
  computed: {
    salaryDifference: function() {
      let companyOneSalaryTotal = 0
      if (this.companyOneDataset && this.companyOneDataset.length > 0) {
        companyOneSalaryTotal = this.sumCompanyData(this.companyOneDataset)
      }
      let companyTwoSalaryTotal = 0
      if (this.companyTwoDataset && this.companyTwoDataset.length > 0) {
        companyTwoSalaryTotal = this.sumCompanyData(this.companyTwoDataset)
      }
      return companyTwoSalaryTotal - companyOneSalaryTotal
    },
    classObject: function() {
      return {
        'title is-2 biggestest': true,
        'negative-number': this.salaryDifference < 0,
        'positive-number': this.salaryDifference > 0
      }
    }
  }
}
</script>

<style scoped>
.biggestest {
  font-size: 3em;
}

.positive-number {
  color: green;
}

.negative-number {
  color: red;
}
</style>
        