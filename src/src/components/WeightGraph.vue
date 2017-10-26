<template>
<!-- Stolen from this great codepen. I like it cause it's still semantic. https://codepen.io/vajkri/pen/NxzZwL-->
    <div>
       <div class="bar-container">
           <div class="bar" style="width:60%"></div>
       </div>
          <div class="bar-container">
           <div class="bar" style="width:20%"></div>
       </div>
    </div>
</template>

<script>
export default {
  name: 'WeightGraph',
  data: function() {
    return {
      values: [
        {
          name: 'itemOne',
          value: 1000
        },
        {
          name: 'item2',
          value: 2000
        }
      ]
    }
  },
  methods: {
    normaliseValue: function(value, maxValue, minValue) {
      // normalise to 0-100 scale
      let normValue = 0 + (100 - 0) * (value - minValue) / (maxValue - minValue)
      return normValue
    }
  }
  //   props: [
  //     {
  //       name: 'values',
  //       type: Array
  //     }
  //   ]
}
</script>

<style lang="css" scoped>
.bar {
  height: 15px;
  max-width: 800px;
  margin: 0 auto 10px auto;
  line-height: 30px;
  font-size: 16px;
  color: white;
  padding: 0 0 0 10px;
  position: relative;
}
.bar::before {
  content: '';
  width: 100%;
  position: absolute;
  left: 0;
  height: 30px;
  top: 0;
  z-index: -2;
  background: #ecf0f1;
}
.bar::after {
  content: '';
  background: #2ecc71;
  height: 30px;
  transition: 0.7s;
  display: block;
  width: 100%;
  -webkit-animation: bar-before 1 1.8s;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.bar1::after {
  max-width: 60%;
}
@-webkit-keyframes bar-before {
  0% {
    width: 0px;
  }
  100% {
    width: 100%;
  }
}
</style>
