<template>
    <span class="title is-2">
        <span class="biggestest">Difference: {{ salaryDifference | currency }}</span>
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
    }
}
</script>

<style scoped>
.biggestest {
    font-size: 3em;
    color: green;
}
</style>
        