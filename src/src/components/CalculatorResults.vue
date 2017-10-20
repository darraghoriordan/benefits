<template>
    <div class="notification is-link">
        <button class="delete"></button>
        Salary: {{ salaryValue }}
        </br> Salary future:
        <ul>
            <li v-for="salary in futureSalaries">Year {{ salary.year }} - {{ salary.value | currency}} [{{ salary.breakdown }}]</li>
        </ul>
        Total earned: {{ totalEarned | currency }}
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
    props: ['salaryValue', 'companyObjectX', 'companyObjectY', 'numberOfYearsToCalculate'],
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

                    if (companyObjectY && companyObjectY[categoryName]) {
                        let currentYProp = companyObjectY[categoryName].find(x => x.name === currentXProp.name)
                        if (!currentYProp) {
                            newCombinedProp.valueY = 0
                        } else {
                            newCombinedProp.valueY = this.calcualtePropValue(currentYProp, annualSalary)
                        }
                    } else {
                        newCombinedProp.valueY = 0
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
                            currentXProp = companyObjectX[categoryName].find(x => x.name === currentYProp.name)
                        }
                    }
                    if (!currentXProp) {
                        let newCombinedProp = {}
                        newCombinedProp.name = currentYProp.name
                        newCombinedProp.valueY = this.calcualtePropValue(currentYProp)
                        newCombinedProp.valueX = 0

                        fieldList.push(newCombinedProp)
                    }
                }
            }

            return fieldList
        },
        calculateAnnualBenefits: function(annualSalary, companyData) {
            let percentageSum = this.calculatePercentageBenefits(annualSalary, companyData)
            let dayLeaveAmount = this.calculateDayLeaveBenefits(annualSalary, companyData)
            let fixedAmountAmount = this.calculateFixedBenefits(annualSalary, companyData)
            let properties = this.getFields(this.companyObjectX, this.companyObjectY, 'benefits', annualSalary)

            return {
                sum: percentageSum + dayLeaveAmount + fixedAmountAmount,
                percentageSum: percentageSum,
                fixedAmountAmount: fixedAmountAmount,
                dayLeaveAmount: dayLeaveAmount,
                propertyCollection: properties
            }
        },
        calculatePercentageBenefit: function (percentageValue, annualSalary) {
            if (annualSalary <= 0) {
                    return 0
            }
            return (percentageValue / 100) * annualSalary
        },
        calculatePercentageBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits) {
                return 0
            }
            let currentInstance = this
            let percentageBenefits = companyData.benefits.filter(n => n.type === 'percent')
            let percentageSum = percentageBenefits.reduce(function(previousValue, currentValue) {
                previousValue += currentInstance.calculatePercentageBenefit(currentValue.value, annualSalary)
                return previousValue
            }, 0)

            return percentageSum
        },
        calculateDayLeaveBenefit: function(dayValue, amortiseOverYears, annualSalary) {
            if (annualSalary <= 0) {
                return 0
            }
            return ((annualSalary / (5 * 52)) * dayValue) / amortiseOverYears
        },
        calculateDayLeaveBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits) {
                return 0
            }
            let currentInstance = this
            let dayLeaveBenefits = companyData.benefits.filter(n => n.type === 'dayLeave')
            let dayLeaveAmount = dayLeaveBenefits.reduce(function(previousValue, currentValue) {
                previousValue += currentInstance.calculateDayLeaveBenefit(currentValue.value, currentValue.amortise, annualSalary)
                return previousValue
            }, 0)

            return dayLeaveAmount
        },
        calculateFixedBenefit: function(fixedAmountValue, amortiseOverYears) {
            return fixedAmountValue / amortiseOverYears
        },
        calculateFixedBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits) {
                return 0
            }
            let currentInstance = this
            let fixedAmountBenefits = companyData.benefits.filter(n => n.type === 'fixedAmount')
            let fixedAmountAmount = fixedAmountBenefits.reduce(function(previousValue, currentValue) {
                previousValue += currentInstance.calculateFixedBenefit(currentValue.value, currentValue.amortise)
                return previousValue
            }, 0)

            return fixedAmountAmount
        }
    },
    computed: {
        futureSalaries: function() {
            let value = this.salaryValue

            let salaryFuture = []
            let standardAnnualRaisePercent = 0.03
            let currentYearDetails = this.calculateAnnualBenefits(value, this.companyData)
            salaryFuture.push({
                year: 1,
                value: value + currentYearDetails.sum,
                propertyCollection: currentYearDetails.propertyCollection,
                breakdown: `salary (${value}) + percentageSum (${currentYearDetails.percentageSum}) + fixedAmountAmount (${currentYearDetails.fixedAmountAmount}) +  dayLeaveAmount (${currentYearDetails.dayLeaveAmount})`
            })

            for (var i = 1; i < this.numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)))
                let bfSum = this.calculateAnnualBenefits(thisYearSalary, this.companyData)
                salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary + bfSum.sum,
                    propertyCollection: bfSum.propertyCollection,
                    breakdown: `salary (${thisYearSalary}) + percentageSum (${bfSum.percentageSum}) + fixedAmountAmount (${bfSum.fixedAmountAmount}) +  dayLeaveAmount (${bfSum.dayLeaveAmount})`

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