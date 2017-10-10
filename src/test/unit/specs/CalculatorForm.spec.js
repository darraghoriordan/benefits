// import Vue from 'vue'
import CalculatorForm from '@/components/CalculatorForm'

describe('CalculatorForm.vue', () => {
  it('has default data', () => {
    const defaultData = CalculatorForm.data()
    console.log(defaultData)
    console.log(defaultData.salaryValue)
    console.log(expect)
    expect(defaultData.salaryValue.toString()).to.be.equal('0')
  })
})
