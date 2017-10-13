<template>
    <canvas width="600" height="400">
    </canvas>
</template>

<script>
import Chart from 'chartjs'

export default {
    name: 'EarningVisualisation',
    props: ['labels', 'companyOneDataset', 'companyTwoDataset', 'companyOneName', 'companyTwoName'],
    methods: {
        makeVisualisation: function() {
            this.chartInstance = new Chart(this.$el, {
                type: 'line',
                data: {
                    labels: this.labels,
                    datasets: [{
                        data: this.companyOneDataset.map(x => x.value),
                        label: this.companyOneName,
                        borderColor: '#3e95cd',
                        fill: false
                    }, {
                        data: this.companyTwoDataset.map(x => x.value),
                        label: this.companyTwoName,
                        borderColor: '#8e5ea2',
                        fill: false
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Potential future earnings'
                    }
                }
            })
        }
    },
    mounted: function() {
        this.makeVisualisation()
    },
    watch: {
        companyOneDataset: function() {
            this.makeVisualisation()
        },
        companyTwoDataset: function() {
            this.makeVisualisation()
        },
        companyOneName: function() {
            this.makeVisualisation()
        },
        companyTwoName: function() {
            this.makeVisualisation()
        }
    },
    data: function() {
        return {
            chartInstance: null
        }
    }
}
</script>