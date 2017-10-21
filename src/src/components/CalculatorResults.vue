<template>
    <div class="notification is-link">
        <button class="delete"></button>
           <!-- <div v-for="entry in getCategoryNameCollection">

               </div> -->
    </div>
</template>

<script>
export default {
    name: 'CalculatorResults',
    data: function() {
        return {
            salaryFuture: [],
            totalEarned: 0
        }
    },
    props: ['salaryValue', 'companyObjectX', 'companyObjectY', 'numberOfYearsToCalculate', 'annualSalaryIncrease'],
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
        getFields: function(companyObjectX, companyObjectY, categoryName, annualSalary) {
            let fieldList = []
            if (companyObjectX) {
                for (var prop in companyObjectX[categoryName]) {
                    let currentXProp = companyObjectX[categoryName][prop]
                    let newCombinedProp = {}
                    newCombinedProp.name = currentXProp.name
                    newCombinedProp.valueX = this.calcualtePropValue(currentXProp, annualSalary)
                    newCombinedProp.valueY = 0

                    if (companyObjectY && companyObjectY[categoryName]) {
                        let currentYProp = companyObjectY[categoryName].find(x => x.name === currentXProp.name)
                        if (currentYProp) {
                            newCombinedProp.valueY = this.calcualtePropValue(currentYProp, annualSalary)
                        }
                    }

                    fieldList.push(newCombinedProp)
                }
            }

            if (companyObjectY) {
                for (var yprop in companyObjectY[categoryName]) {
                    let currentYProp = companyObjectY[categoryName][yprop]
                    let currentXProp = null
                    if (companyObjectX && companyObjectX[categoryName]) {
                        currentXProp = companyObjectX[categoryName].find(x => x.name === currentYProp.name)
                    }
                    if (!currentXProp) {
                        let newCombinedProp = {}
                        newCombinedProp.name = currentYProp.name
                        newCombinedProp.valueY = this.calcualtePropValue(currentYProp, annualSalary)
                        newCombinedProp.valueX = 0

                        fieldList.push(newCombinedProp)
                    }
                }
            }

            return fieldList
        },
        calculateAnnualBenefits: function(annualSalary, companyData) {
            return {
                propertyCollection: this.getFields(this.companyObjectX, this.companyObjectY, 'benefits', annualSalary)
            }
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
        }
    },
    computed: {
        futureSalaries: function() {
            let value = this.salaryValue

            let salaryFuture = []
            let standardAnnualRaisePercent = this.annualSalaryIncrease
            let currentYearDetails = this.calculateAnnualBenefits(value, this.companyData)
            salaryFuture.push({
                year: 1,
                value: value,
                propertyCollection: currentYearDetails.propertyCollection
            })

            for (var i = 1; i < this.numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)))
                let bfSum = this.calculateAnnualBenefits(thisYearSalary, this.companyData)
                salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary,
                    propertyCollection: bfSum.propertyCollection
                })
            }

            this.totalEarned = salaryFuture.reduce(
                function(accumulator, currentValue) {
                    return accumulator + currentValue.value
                }, 0
            )
            this.$emit('changeSalaryFuture', salaryFuture)
            return salaryFuture
        }
    }
}
</script>