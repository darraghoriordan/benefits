<template>
    <span v-bind:class="classObject" ref="title-container">
        {{ salaryDifference | currency }}
    </span>
</template>

<script>

export default {
    name: 'DifferenceResult',
    props: {
        salaryDifference: {
            type: Number,
            required: true
        }
    },
    filters: {
        currency: function(value) {
            return '$' + value.toFixed(2)
        }
    },
    computed: {
        classObject: function() {
            return {
                'title is-2 biggestest': true,
                'negative-number': this.salaryDifference < 0,
                'positive-number': this.salaryDifference > 0
            }
        }
    }
}
</script>

<style scoped>
.biggestest {
    font-size: 3em;
}

.positive-number {
    color: green;
}

.negative-number {
    color: red;
}
</style>
        