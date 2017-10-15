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
    props: ['salaryValue', 'companyData', 'numberOfYearsToCalculate'],
    filters: {
        currency: function(value) {
            return '$' + value.toFixed(2)
        }
    },
    methods: {
        calculateFixedBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits) {
                return {
                    sum: 0,
                    percentageSum: 0,
                    fixedAmountAmount: 0,
                    dayLeaveAmount: 0
                }
            }
            // add percentage things
            let percentageBenefits = companyData.benefits.filter(n => n.type === 'percent')
            let percentageSum = percentageBenefits.reduce(function(previousValue, currentValue) {
                previousValue += ((currentValue.value / 100) * annualSalary)
                return previousValue
            }, 0)
            // get all type: fixedAmount
            let fixedAmountBenefits = companyData.benefits.filter(n => n.type === 'fixedAmount')
            let fixedAmountAmount = fixedAmountBenefits.reduce(function(previousValue, currentValue) {
                previousValue += (currentValue.value / currentValue.amortise)
                return previousValue
            }, 0)

            // get all type:daysLeave
            let dayLeaveBenefits = companyData.benefits.filter(n => n.type === 'dayLeave')
            let dayLeaveAmount = dayLeaveBenefits.reduce(function(previousValue, currentValue) {
                previousValue += (((annualSalary / (5 * 52)) * currentValue.value) / currentValue.amortise)
                return previousValue
            }, 0)
            let sumOfParts = percentageSum + fixedAmountAmount + dayLeaveAmount

            return {
                sum: sumOfParts,
                percentageSum: percentageSum,
                fixedAmountAmount: fixedAmountAmount,
                dayLeaveAmount: dayLeaveAmount
            }
        }
    },
    computed: {
        futureSalaries: function() {
            let value = this.salaryValue

            let salaryFuture = []
            let standardAnnualRaisePercent = 0.03
            let currentYearDetails = this.calculateFixedBenefits(value, this.companyData)

            salaryFuture.push({
                year: 1,
                value: value + currentYearDetails.sum,
                breakdown: `salary (${value}) + percentageSum (${currentYearDetails.percentageSum}) + fixedAmountAmount (${currentYearDetails.fixedAmountAmount}) +  dayLeaveAmount (${currentYearDetails.dayLeaveAmount})`
            })

            for (var i = 1; i < this.numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)))
                let bfSum = this.calculateFixedBenefits(thisYearSalary, this.companyData)
                salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary + bfSum.sum,
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