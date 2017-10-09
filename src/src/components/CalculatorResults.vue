<template>
    <div>
        Old Salary: {{ salaryValue }}
        </br> old salary future:
        <ul>
            <li v-for="salary in salaryFuture">Year {{ salary.year }} - {{ salary.value }}</li>
        </ul>
        total earned: {{ totalEarned }}
    </div>
</template>

<script>
export default {
    name: 'CalculatorResults',
    data: function() {
        return {
            salaryFuture: [],
            totalEarned: 0
        };
    },
    props: ['salaryValue', 'companyData'],
    methods: {
        calculateFixedBenefits: function(annualSalary, companyData) {
            if (!companyData || !companyData.benefits)
                return 0;
            //add percentage things 
            let percentageBenefits = companyData.benefits.filter(n => n.type == 'percent');
            let percentageSum = percentageBenefits.reduce(function(previousValue, currentValue) {
                return previousValue += ((currentValue.value / 100) * annualSalary)

            }, 0);
            //get all type: fixedAmount 
            //divide value by amortisation
            // sum

            // get all type:daysLeave
            // (salary * time)/(amortization [if any])  = (salaryValue)/(40*52) *  ((8 * daysLeaveValue) / amortization)
            // sum

            return percentageSum;
        }
    },
    watch: {
        salaryValue: function() {
            let value = this.salaryValue;

            this.salaryFuture = [];
            let numberOfYearsToCalculate = 5;
            let standardAnnualRaisePercent = .03;
            this.salaryFuture.push({
                year: 1,
                value: value + this.calculateFixedBenefits(value, this.companyData)
            })

            for (i = 1; i < numberOfYearsToCalculate; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (standardAnnualRaisePercent) / 1), i)));
                let bfSum = this.calculateFixedBenefits(thisYearSalary, this.companyData);
                this.salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary + bfSum
                })
            }

            this.totalEarned = this.salaryFuture.reduce(
                function(accumulator, currentValue) {
                    return accumulator + currentValue.value;
                }, 0
            )
            this.$emit('changeSalaryFuture', this.salaryFuture)
        }
    }
}
</script>