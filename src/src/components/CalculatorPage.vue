<template>
    <div>

        <YearsToCalculate :value="yearsToCalculate" @input="changeYearsToCalculate"></YearsToCalculate>
        <div class="columns">
            <div class="column">
                <h2 class="title is-2">Offer One</h2>
                <SalaryInput @input="changeLeftSalaryValue"></SalaryInput>
                <CompanySelection @selected="selectedLeft" :company-collection="companyCollection">
                </CompanySelection>
            </div>

            <div class="column">
                <h2 class="title is-2">Offer Two</h2>
                <SalaryInput @input="changeRightSalaryValue"></SalaryInput>
                <CompanySelection @selected="selectedRight" :company-collection="companyCollection">
                </CompanySelection>
            </div>
        </div>
        <DifferenceResult :salaryDifference="salaryDifference"></DifferenceResult>
        <div class="columns">
            <div class="column">
                <CalculatorResults :salary-value="leftSalary" :numberOfYearsToCalculate="yearsToCalculate" :company-data="leftCompany" @changeSalaryFuture="changeLeftSalaryFuture">
                </CalculatorResults>
            </div>
            <div class="column">
                <CalculatorResults :salary-value="rightSalary" :numberOfYearsToCalculate="yearsToCalculate" :company-data="rightCompany" @changeSalaryFuture="changeRightSalaryFuture"></CalculatorResults>
            </div>
        </div>

        <div>
            <ComparisonGrid :leftCompany="leftCompany" :rightCompany="rightCompany"></ComparisonGrid>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import SalaryInput from './SalaryInput'
import CompanySelection from './CompanySelection'
import CalculatorResults from './CalculatorResults'
import ComparisonGrid from './ComparisonGrid'
import EarningVisualisation from './EarningVisualisation'
import DifferenceResult from './DifferenceResult'
import YearsToCalculate from './YearsToCalculate'
export default {
    name: 'CalculatorPage',
    components: { SalaryInput, CompanySelection, CalculatorResults, ComparisonGrid, EarningVisualisation, DifferenceResult, YearsToCalculate },
    data: function() {
        return {
            yearsToCalculate: 8,
            companyCollection: [],
            leftCompany: {},
            rightCompany: {},
            leftSalary: 0,
            rightSalary: 0,
            graphLabels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
            companyOneDataset: [],
            companyTwoDataset: [],
            companyOneName: '',
            companyTwoName: ''
        }
    },
    created: function() {
        this.loadData()
    },
    computed: {
        salaryDifference: function() {
            let oneSum = this.companyOneDataset.reduce((a, b) => a + b.value, 0)
            let twoSum = this.companyTwoDataset.reduce((a, b) => a + b.value, 0)
            return twoSum - oneSum
        }
    },
    methods: {
        changeYearsToCalculate: function(value) {
            this.yearsToCalculate = value
        },
        changeLeftSalaryFuture: function(value) {
            this.companyOneDataset = value
        },
        changeRightSalaryFuture: function(value) {
            this.companyTwoDataset = value
        },
        changeLeftSalaryValue: function(value) {
            this.leftSalary = value
        },
        changeRightSalaryValue: function(value) {
            this.rightSalary = value
        },
        selectedLeft: function(value) {
            let localValue = value
            this.leftCompany = this.companyCollection.find(
                function(x) {
                    let result = x.company.find(n => n.name === 'Company Name').value === localValue
                    return result
                })
            let foundName = ''
            if (this.leftCompany) {
                foundName = this.leftCompany.company.find(n => n.name === 'Company Name').value
            }
            this.companyOneName = foundName
        },
        selectedRight: function(value) {
            let localValue = value
            this.rightCompany = this.companyCollection.find(
                function(x) {
                    let result = x.company.find(n => n.name === 'Company Name').value === localValue
                    return result
                }
            )
            let foundName = ''
            if (this.rightCompany) {
                foundName = this.rightCompany.company.find(n => n.name === 'Company Name').value
            }
            this.companyTwoName = foundName
        },
        loadData: function() {
            var ctrl = this
            axios.get('/static/data.json', {
                'encodingType': 'UTF8'
            })
                .then(function(response) {
                    ctrl.companyCollection = response.data.data
                })
        }
    }
}
</script>