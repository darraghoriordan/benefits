// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
    methods: {
        calcualteValue: function (prop) {
            if (!prop) {
                return 'Unknown';
            }
            if (prop.type == 'bool') {
                if (prop.value == 'true') {
                    return "Yes"
                }
                return 'No';
            }
            if (prop.type == 'percent') {
                return prop.value + '%';
            }

            return prop.value;
        }
    },
    props: {
        leftCompare: {},
        rightCompare: {}
    },
    computed: {
        comparisonTable: function () {
            let combinedData = [];
            for (var key in this.leftCompare) {
                if (this.leftCompare.hasOwnProperty(key)) {
                    combinedData.push(key);
                    for (var prop in this.leftCompare[key]) {
                        if (this.leftCompare[key].hasOwnProperty(prop)) {
                            let currentProp = this.leftCompare[key][prop];
                            combinedData[key].push({
                                name: prop.name,
                                leftValue: this.calculateValue(prop),
                                rightValue: this.calculateValue(prop)
                            })
                        }
                    }
                }
            }
            for (var key in this.rightCompare) {
                if (this.rightCompare.hasOwnProperty(key)) {
                    if (!combinedData.includes(key)) {
                        combinedData.push(key);
                    }
                }
            }


            //for each heading
            // for each prop on left add the left and right value
            // for each prop on right add the left value
            return combinedData;
        }
    }
})

Vue.component('company-selection', {
    props: {
        companyCollection: {
            type: Array,
            required: true
        }
    },

    data: function () {
        return {
            selected: "selected",
            rowId: 10
        }
    },
    template: `<select @change="changeItem(rowId, $event)">
                <option disabled value="">Select a company</option>
                <option :value="item.company.name" v-for="item in companyCollection">
                {{item.company.name}}
                </option>
                </select>`,
    methods: {
        changeItem: function (rowId, event) {
            this.selected = `${rowId}, ${event.target.value}`
            this.$emit('selected', event.target.value)
        }
    }
});

new Vue({
    el: '#appContainer',
    template: '#app-template',
    data: {
        companyCollection: [],
        leftThing: {},
        rightThing: {}
    },
    created: function () {
        this.loadData()
    },
    methods: {
        selectedLeft: function (value) {
            this.leftThing = this.companyCollection.filter(x => x.company.name == value)[0]
        },
        selectedRight: function (value) {
            this.rightThing = this.companyCollection.filter(x => x.company.name == value)[0]

        },
        loadData: function () {
            var ctrl = this;
            axios.get('/data.json', {
                    "encodingType": "UTF8"
                })
                .then(function (response) {
                    ctrl.companyCollection = response.data.data;
                });
        }
    }
});