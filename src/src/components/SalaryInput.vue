<template>
    <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Salary</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="salary">
                </div>
            </div>
        </div>
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