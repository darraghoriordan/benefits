<template>
    <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Expected Annual Salary Increase (%)</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AnnualSalaryIncreaseInput',
  props: {
    value: {
      type: Number,
      default: 3
    }
  },
  methods: {
    updateValue: function(value) {
      var formattedValue = Number(value.trim())
      if (isNaN(formattedValue)) {
        formattedValue = 0
      }
      this.$refs.input.value = formattedValue
      this.$emit('input', formattedValue)
    }
  }
}
</script>