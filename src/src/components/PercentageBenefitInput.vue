<template>
<div>
   <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Name</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input" type="text" v-bind:value="nameValue" v-on:input="updateNameValue($event.target.value)" ref="input">
                </div>
            </div>
        </div>
    </div>
       <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Percentage</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input" type="text" v-bind:value="percentageValue" v-on:input="updatePercentageValue($event.target.value)" ref="input">
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
// take a configuration prop in json
// foreach prop type create a new component of type prop.type
// ability to add a new prop of any type at the bottom (+ and buttons)?
// output would be the same json config as currently used
</script>

<style>
</style>
