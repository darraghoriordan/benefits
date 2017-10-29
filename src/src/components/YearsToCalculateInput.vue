<template>
    <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Years</label>
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
  name: 'YearsToCalculateInput',
  props: {
    value: {
      type: Number,
      default: 5
    }
  },
  methods: {
    updateValue: function(value) {
      var formattedValue = Number(value.trim())
      console.log(formattedValue)
      if (isNaN(formattedValue)) {
        formattedValue = 0
      }
        this.$refs.input.value = formattedValue
      this.$emit('input', Number(formattedValue))
    }
  }
}
</script>