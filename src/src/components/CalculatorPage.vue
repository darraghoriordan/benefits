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
        <div class="columns">
            <div class="column">
                <CalculatorResults :annualSalaryIncrease="0.03" :salary-value="leftSalary" :numberOfYearsToCalculate="yearsToCalculate" :company-object="leftCompany" @changeAnnualSalaryCollection="changeLeftSalaryFuture">
                </CalculatorResults>
            </div>         
                        <div class="column">
                <CalculatorResults :annualSalaryIncrease="0.03" :salary-value="rightSalary" :numberOfYearsToCalculate="yearsToCalculate" :company-object="rightCompany" @changeAnnualSalaryCollection="changeRightSalaryFuture">
                </CalculatorResults>
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
import DifferenceResult from './DifferenceResult'
import YearsToCalculate from './YearsToCalculate'
export default {
    name: 'CalculatorPage',
    components: { SalaryInput, CompanySelection, CalculatorResults, ComparisonGrid, DifferenceResult, YearsToCalculate },
    data: function() {
        return {
            yearsToCalculate: 4,
            companyCollection: [],
            leftCompany: {},
            rightCompany: {},
            leftSalary: 0,
            rightSalary: 0,
            companyOneDataset: [],
            companyTwoDataset: [],
            companyOneName: '',
            companyTwoName: ''
        }
    },
    created: function() {
        this.loadData()
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
            }).then(function(response) {
                    ctrl.companyCollection = response.data.data
                })
        }
    }
}
</script>