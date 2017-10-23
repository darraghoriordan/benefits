<template>
    <div>
        <YearsToCalculate :value="yearsToCalculate" @input="changeYearsToCalculate"></YearsToCalculate>
        <div class="columns">
            <div class="column">
                <h2 class="title is-2">Offer One</h2>
                <SalaryInput @input="changeLeftSalaryValue" :value="0"></SalaryInput>
                <CompanySelection @selected="selectedLeft" :company-collection="companyCollection">
                </CompanySelection>
            </div>

            <div class="column">
                <h2 class="title is-2">Offer Two</h2>
                <SalaryInput @input="changeRightSalaryValue" :value="0"></SalaryInput>
                <CompanySelection @selected="selectedRight" :company-collection="companyCollection">
                </CompanySelection>
            </div>
        </div>
        <DifferenceResult :company-one-dataset="companyOneDataset" :company-two-dataset="companyTwoDataset"></DifferenceResult>
        <div>
            <ComparisonGrid :leftCompany="companyOne" :rightCompany="companyTwo"></ComparisonGrid>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import SalaryInput from './SalaryInput'
import CompanySelection from './CompanySelection'
import ComparisonGrid from './ComparisonGrid'
import DifferenceResult from './DifferenceResult'
import YearsToCalculate from './YearsToCalculate'
export default {
  name: 'CalculatorPage',
  components: {
    SalaryInput,
    CompanySelection,
    ComparisonGrid,
    DifferenceResult,
    YearsToCalculate
  },
  data: function() {
    return {
      yearsToCalculate: 4,
      companyCollection: [],
      companyOne: {},
      companyTwo: {},
      salaryOne: 0,
      salaryTwo: 0
    }
  },
  computed: {
    companyOneDataset: function() {
      return this.calculateAnnualSalaryCollection(
        this.salaryOne,
        this.companyOne,
        0.3,
        this.yearsToCalculate
      )
    },
    companyTwoDataset: function() {
      return this.calculateAnnualSalaryCollection(
        this.salaryTwo,
        this.companyTwo,
        0.3,
        this.yearsToCalculate
      )
    }
  },
  created: function() {
    this.loadData()
  },
  methods: {
    calculateAnnualSalaryCollection: function(
      salaryValue,
      companyObject,
      annualSalaryIncrease,
      numberOfYearsToCalculate
    ) {
      let annualSalaryCollection = []

      let firstYearBenefitsCollection = this.calculateBenefits(
        salaryValue,
        companyObject
      )
      annualSalaryCollection.push({
        year: 1,
        salary: salaryValue,
        benefitsCollection: firstYearBenefitsCollection
      })

      for (var i = 1; i < numberOfYearsToCalculate; i++) {
        let thisYearSalary = Math.floor(
          salaryValue * Math.pow(1 + annualSalaryIncrease / 1, i)
        )
        let benefitsCollection = this.calculateBenefits(
          thisYearSalary,
          companyObject
        )
        annualSalaryCollection.push({
          year: 1 + i,
          salary: thisYearSalary,
          benefitsCollection: benefitsCollection
        })
      }
      return annualSalaryCollection
    },
    calcualtePropValue: function(prop, annualSalary) {
      if (!prop) {
        return 0
      }
      if (prop.type === 'dayLeave') {
        return this.calculateDayLeaveBenefit(
          prop.value,
          prop.amortise,
          annualSalary
        )
      }
      if (prop.type === 'fixedAmount') {
        return this.calculateFixedBenefit(prop.value, prop.amortise)
      }
      if (prop.type === 'percent') {
        return this.calculatePercentageBenefit(prop.value, annualSalary)
      }

      return 0
    },
    calculateBenefits: function(annualSalary, companyObject) {
      let fieldList = []
      if (!companyObject || !companyObject.benefits) {
        return fieldList
      }
      for (let i = 0; i < companyObject.benefits.length; i++) {
        let currentXProp = companyObject.benefits[i]
        let newCombinedProp = {}
        newCombinedProp.name = currentXProp.name
        newCombinedProp.value = this.calcualtePropValue(
          currentXProp,
          annualSalary
        )
        fieldList.push(newCombinedProp)
      }
      return fieldList
    },
    calculatePercentageBenefit: function(percentageValue, annualSalary) {
      if (annualSalary <= 0) {
        return 0
      }
      return percentageValue / 100 * annualSalary
    },
    calculateDayLeaveBenefit: function(
      dayValue,
      amortiseOverYears,
      annualSalary
    ) {
      if (annualSalary <= 0) {
        return 0
      }
      return annualSalary / (5 * 52) * dayValue / amortiseOverYears
    },
    calculateFixedBenefit: function(fixedAmountValue, amortiseOverYears) {
      return fixedAmountValue / amortiseOverYears
    },
    changeYearsToCalculate: function(value) {
      this.yearsToCalculate = value
    },
    changeLeftSalaryValue: function(value) {
      this.salaryOne = value
    },
    changeRightSalaryValue: function(value) {
      this.salaryTwo = value
    },
    selectedLeft: function(value) {
      let localValue = value
      this.companyOne = this.companyCollection.find(function(x) {
        let result =
          x.company.find(n => n.name === 'Company Name').value === localValue
        return result
      })
    },
    selectedRight: function(value) {
      let localValue = value
      this.companyTwo = this.companyCollection.find(function(x) {
        let result =
          x.company.find(n => n.name === 'Company Name').value === localValue
        return result
      })
    },
    loadData: function() {
      var ctrl = this
      axios
        .get('/static/data.json', {
          encodingType: 'UTF8'
        })
        .then(function(response) {
          ctrl.companyCollection = response.data.data
        })
    }
  }
}
</script>