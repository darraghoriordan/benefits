// import Vue from 'vue'
import SalaryInput from '@/components/SalaryInput'

describe('SalaryInput.vue', () => {
  it('has default data', () => {
    const defaultData = SalaryInput.data()
    console.log(defaultData)
    console.log(defaultData.salaryValue)
    console.log(expect)
    expect(defaultData.salaryValue.toString()).to.be.equal('0')
  })
})
