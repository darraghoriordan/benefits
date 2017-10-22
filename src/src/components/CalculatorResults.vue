<template>
    <div class="notification is-link">
        <button class="delete"></button>
            <div v-for="entry in annualSalaryCollection">

            </div>
    </div>
</template>

<script>
export default {
    name: 'CalculatorResults',
    props: ['salaryValue', 'companyObject', 'numberOfYearsToCalculate', 'annualSalaryIncrease'],
    filters: {
        currency: function(value) {
            return '$' + value.toFixed(2)
        }
    },
    methods: {
          calcualtePropValue: function(prop, annualSalary) {
            if (!prop) {
                return 0
            }
            if (prop.type === 'dayLeave') {
                return this.calculateDayLeaveBenefit(prop.value, prop.amortise, annualSalary)
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
                    newCombinedProp.value = this.calcualtePropValue(currentXProp, annualSalary)

                    fieldList.push(newCombinedProp)
                }
            return fieldList
        },
        calculatePercentageBenefit: function (percentageValue, annualSalary) {
            if (annualSalary <= 0) {
                    return 0
            }
            return (percentageValue / 100) * annualSalary
        },
        calculateDayLeaveBenefit: function(dayValue, amortiseOverYears, annualSalary) {
            if (annualSalary <= 0) {
                return 0
            }
            return ((annualSalary / (5 * 52)) * dayValue) / amortiseOverYears
        },
        calculateFixedBenefit: function(fixedAmountValue, amortiseOverYears) {
            return fixedAmountValue / amortiseOverYears
        },
          sumBenefits: function(propCollection) {
            return propCollection.reduce(
                function(accumulator, currentValue) {
                    return accumulator + currentValue.value
                }, 0
            )
        }
    },
    computed: {
        annualSalaryCollection: function() {
            let newSalaryValue = this.salaryValue
            let selectedCompany = this.companyObject
            let standardAnnualRaisePercent = this.annualSalaryIncrease
            let annualSalaryCollection = []

            let firstYearBenefitCollection = this.calculateBenefits(newSalaryValue, selectedCompany)
            annualSalaryCollection.push({
                year: 1,
                salary: newSalaryValue + this.sumBenefits(firstYearBenefitCollection),
                benefitCollection: firstYearBenefitCollection
            })

            for (var i = 1; i < this.numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(newSalaryValue * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)))
                let benefitCollection = this.calculateBenefits(thisYearSalary, selectedCompany)
                annualSalaryCollection.push({
                    year: 1 + i,
                    salary: thisYearSalary + this.sumBenefits(benefitCollection),
                    benefitCollection: benefitCollection
                })
            }

            this.$emit('changeAnnualSalaryCollection', annualSalaryCollection)
            return annualSalaryCollection
        }
    }
}
</script>