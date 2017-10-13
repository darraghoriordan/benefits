<template>
    <div>
        <span class="biggestest">{{ salaryDifference | currency }}</span>
        <div class="columns">
            <div class="column">
                <h2 class="title is-2">You</h2>
                <SalaryInput @input="changeLeftSalaryValue"></SalaryInput>
                <CompanySelection @selected="selectedLeft" :company-collection="companyCollection">
                </CompanySelection>
                <CalculatorResults :salary-value="leftSalary" :company-data="leftCompany" @changeSalaryFuture="changeLeftSalaryFuture">
                </CalculatorResults>
            </div>
            <div class="column">
                <h2 class="title is-2">Them</h2>
                <SalaryInput @input="changeRightSalaryValue"></SalaryInput>
                <CompanySelection @selected="selectedRight" :company-collection="companyCollection">
                </CompanySelection>
                <CalculatorResults :salary-value="rightSalary" :company-data="rightCompany" @changeSalaryFuture="changeRightSalaryFuture"></CalculatorResults>
            </div>
        </div>

        <div class="">
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

export default {
    name: 'CalculatorPage',
    components: { SalaryInput, CompanySelection, CalculatorResults, ComparisonGrid, EarningVisualisation },
    data: function() {
        return {
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
    filters: {
        currency: function(value) {
            return '$' + value.toFixed(2)
        }
    },
    methods: {
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

<style scoped>
.biggestest {
    font-size: 3em;
    color: green;
}
</style>