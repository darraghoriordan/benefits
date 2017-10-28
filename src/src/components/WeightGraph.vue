<template>
<!-- Stolen from this great codepen. I like it cause it's still semantic. https://codepen.io/vajkri/pen/NxzZwL-->
<div class="graph-container">
      <ul class="chart">
        <li v-for="item in normalisedValues" class="chart__item" >       
               <div class="chart__left-bar-container ">
            <span class="chart__bar chart__bar--left-direction" v-bind:style="{ width: item.normalisedValue + '%' }">          
            </span>
            </div>
            <span class="chart__label">
            {{item.name}} ({{ item.value | currency }})
            </span>
            <div>
            <span class="chart__bar chart__bar--right-direction" v-bind:style="{ width: item.normalisedValue + '%' }">          
            </span>
            </div>
        </li>
      </ul>
</div>
</template>

<script>
export default {
  name: 'WeightGraph',
  filters: {
    currency: function(value) {
      return '$' + value.toFixed(2)
    }
  },
  methods: {
    normaliseValue: function(value, total) {
      // normalise to 0-100 scale
      if (value === 0) {
        return 0
      }

      let normValue = Math.floor(100 * (value / total))
      return normValue
    },
    compareNormalisedValues: function compare(a, b) {
      if (a.normalisedValue > b.normalisedValue) return -1
      if (a.normalisedValue < b.normalisedValue) return 1
      return 0
    }
  },
  computed: {
    normalisedValues: function() {
      let vueComponent = this

      return this.values
        .map(function(element) {
          return {
            name: element.name,
            value: element.value,
            normalisedValue: vueComponent.normaliseValue(
              element.value,
              vueComponent.totalDifference,
              0
            )
          }
        }, this)
        .filter(function(element) {
          return element.normalisedValue > 0
        })
        .sort(this.compareNormalisedValues)
    }
  },
  props: ['values', 'totalDifference']
}
</script>

<style lang="scss" scoped>
.chart {
  margin: auto;
  width: 80%;
  padding-left: 0;
  &:first-child {
    margin: 0;
  }
}
.chart__item {
  display: flex;
  margin-bottom: 10px;
}
.chart__item * {
  width: 33%;
}
.chart__left-bar-container {
  text-align: right;
}
  $border-rad: 4px;
.chart__bar--left-direction {
  background: linear-gradient(to right, #4cb8c4, #3cd3ad);
  border-top-left-radius: $border-rad;
  border-bottom-left-radius: $border-rad;
}
.chart__bar--right-direction {
  background: linear-gradient(to left, #4cb8c4, #3cd3ad);
  border-top-right-radius: $border-rad;
  border-bottom-right-radius: $border-rad;
}
.chart__bar {
  height: 30px;
  display: inline-block;
  width: 66%;
  opacity: 1;
}

.chart__label {
  text-align: center;
  width: 33%;
  line-height: 30px;
}
</style>
