<template>
    <div class="form-group row">
        <label for="salaryValue" class="col-2 col-form-label">Salary</label>
        <div class="col-10">
            <input v-model.number="salaryValue" class="form-control" placeholder="salary" type="number" id="salaryValue">
        </div>
    </div>
</template>

<script>
export default {
    name: 'CalculatorForm',
    template: '#calculator-form-template',
    data: function() {
        return {
            salaryValue: 0,
        }
    },
    watch: {
        salaryValue: function(val, oldVal) {
            this.$emit('changeSalaryValue', val)
        }
    }
}
</script>