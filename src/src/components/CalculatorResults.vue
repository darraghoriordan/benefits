<template>
    <div class="notification is-link">
        <button class="delete"></button>
        Salary: {{ salaryValue }}
        </br> Salary future:
        <ul>
            <li v-for="salary in futureSalaries">Year {{ salary.year }} - {{ salary.value | currency}}</li>
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
    props: ['salaryValue', 'companyData'],
    filters: {
        currency: function(value) {
            return '$' + value.toFixed(2)
        }
    },
    methods: {
        calculateFixedBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits) {
                return 0
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
            return percentageSum + fixedAmountAmount + dayLeaveAmount
        }
    },
    computed: {
        futureSalaries: function() {
            let value = this.salaryValue

            let salaryFuture = []
            let numberOfYearsToCalculate = 5
            let standardAnnualRaisePercent = 0.03
            salaryFuture.push({
                year: 1,
                value: value + this.calculateFixedBenefits(value, this.companyData)
            })

            for (var i = 1; i < numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)))
                let bfSum = this.calculateFixedBenefits(thisYearSalary, this.companyData)
                salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary + bfSum
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