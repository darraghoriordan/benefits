<template>
<!-- Stolen from this great codepen. I like it cause it's still semantic. https://codepen.io/vajkri/pen/NxzZwL-->
<div class="graph-container">
<div class="skills">
  <div class="charts">
    <div class="chart chart--dev">
      <ul class="chart--horiz">
        <li v-for="item in normalisedValues" class="chart__item" >
          <span class="chart__label">
           {{item.name}}
          </span>
        <span class="chart__bar" v-bind:style="{ width: item.normalisedValue + '%' }">          
          </span>
        </li>       
      </ul>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  name: 'WeightGraph',
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
.charts {
  margin: auto;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.chart {
  margin: 30px 0 0;

  &:first-child {
    margin: 0;
  }
}

.chart--horiz {
  overflow: hidden;
}
.chart__item {
  margin-bottom: 10px;
}
.chart__bar {
  $border-rad: 4px;
  height: 30px;
  display:inline-block;
  width:66%;
  background: linear-gradient(to left, #4cb8c4, #3cd3ad);
  border-top-right-radius: $border-rad;
  border-bottom-right-radius: $border-rad;
  opacity: 1;
}

.chart__label {
  text-align: right;
  width:33%;
  line-height: 30px;
}
</style>
