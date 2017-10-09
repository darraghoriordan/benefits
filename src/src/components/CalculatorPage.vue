<template>
    <div>
        <div class="row ml-1 mr-1">
            <div class="col-6">
                <CalculatorForm @changeSalaryValue="changeLeftSalaryValue"></CalculatorForm>
                <company-selection @selected="selectedLeft" :company-collection="companyCollection">
                </company-selection>

                <calculator-results :salary-value="leftSalary" :company-data="leftCompany" @changeSalaryFuture="changeLeftSalaryFuture"></calculator-results>
            </div>
            <div class="col-6">
                <CalculatorForm @changeSalaryValue="changeRightSalaryValue"></CalculatorForm>
                <company-selection @selected="selectedRight" :company-collection="companyCollection">
                </company-selection>

                <calculator-results :salary-value="rightSalary" :company-data="rightCompany" @changeSalaryFuture="changeRightSalaryFuture"></calculator-results>
            </div>
        </div>
        <hr>
        <div class="row ml-1 mr-1">
            <div class="col">
                <comparison-grid :leftCompany="leftCompany" :rightCompany="rightCompany"></comparison-grid>
            </div>
        </div>
        <div class="row ml-1 mr-1">
            <earning-difference-visualization :labels="graphLabels" :company-one-name="companyOneName" :company-two-name="companyTwoName" :company-one-dataset="companyOneDataset" :company-two-dataset="companyTwoDataset"></earning-difference-visualization>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import CalculatorForm from './CalculatorForm'
export default {
    name: 'CalculatorPage',
    components: { CalculatorForm },
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
            axios.get('/data.json', {
                'encodingType': 'UTF8'
            })
                .then(function(response) {
                    ctrl.companyCollection = response.data.data
                })
        }
    }
}
</script>