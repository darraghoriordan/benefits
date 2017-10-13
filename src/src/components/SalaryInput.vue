<template>
    <div>
        <label for="salaryValue">Salary</label>
        <input v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="salary">
    </div>
</template>

<script>
export default {
    name: 'SalaryInput',
    props: ['value'],
    data: function() {
        return {
            salaryValue: 0
        }
    },
    methods: {
        updateValue: function(value) {
            var formattedValue = value
                .trim()
                .slice(
                0,
                value.indexOf('.') === -1
                    ? value.length
                    : value.indexOf('.') + 3
                )
            // If the value was not already normalized,
            // manually override it to conform
            if (formattedValue !== value) {
                this.$refs.input.value = formattedValue
            }
            // Emit the number value through the input event
            this.$emit('input', Number(formattedValue))
        }
    }
}
</script>