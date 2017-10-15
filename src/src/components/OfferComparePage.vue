<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Number of years to calc</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <span>Result with a breakdown</span>
        </div>
        <div class="columns">
            <div class="column">
                <h2 class="title">Awesome offer 1</h2>

                <h4 class="title is-4">Salary</h4>
                <SalaryInput></SalaryInput>
                <h4 class="title is-4">Benefits</h4>
                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Superannuation</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Vacation Days</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Additional Days</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Health Insurance</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Other Insurance</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field is-horizontal">
                    <div class="field-label is-small">
                        <label class="label">Industry Discounts</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" v-bind:value="value" v-on:input="updateValue($event.target.value)" ref="input" placeholder="Enter the name to save...">
                            </div>
                        </div>
                    </div>
                </div>
                <h4 class="title is-4">Learning</h4>
                <h4 class="title is-4">Perks</h4>
            </div>
            <div class="column"></div>
        </div>
    </div>
</template>

<script>
import SalaryInput from './SalaryInput'
export default {
    name: 'OfferComparePage',
    components: { SalaryInput }
}
</script>

<style scoped>
.biggestest {
    font-size: 3em;
    color: green;
    margin-top: 1em;
}
</style>