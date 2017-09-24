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
        },
        getFields: function (companyObjectX, companyObjectY, categoryName) {
            let fieldList = [];
            //for all the props in X create as new and then check value in Y

            for (var prop in companyObjectX[categoryName]) {
                if (!companyObjectX[categoryName].hasOwnProperty(prop)) {
                    // not a specific property
                    continue;
                }
                let currentXProp = companyObjectX[categoryName][prop];
                let newCombinedProp = {};
                newCombinedProp.name = currentXProp.name;
                newCombinedProp.valueX = currentXProp.value;

                if (companyObjectY && companyObjectY[categoryName]) {
                    let currentYProp = companyObjectY[categoryName].find(x => x.name === currentXProp.name);
                    if (!currentYProp) {
                        newCombinedProp.valueY = "Unknown";
                    } else {
                        newCombinedProp.valueY = currentYProp.value;
                    }
                } else {
                    newCombinedProp.valueY = "Unknown";
                }

                fieldList.push(newCombinedProp);

            }
            //TODO: for all the props in Y where the prop doesnt already exist add and set X to unknown  
            return fieldList;
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
                if (!this.leftCompare.hasOwnProperty(key)) {
                    continue;
                }
                let category = {};
                category.name = key;
                category.fields = this.getFields(this.leftCompare, this.rightCompare, category.name)

                combinedData.push(category);
            }

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
    computed: {
        companyNameList: function () {
            let list = this.companyCollection.map(
                x => x.company.find(n => n.name == "Company Name").value
            );
            return list;
        }
    },
    template: `<select @change="changeItem(rowId, $event)">
                <option disabled value="">Select a company</option>
                <option :value="item" v-for="item in companyNameList">
                {{ item }}
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
            let localValue = value;
            this.leftThing = this.companyCollection.find(
                function (x) {
                    let result = x.company.find(n => n.name == "Company Name").value === localValue;
                    return result;
                })

        },
        selectedRight: function (value) {
            let localValue = value;
            this.rightThing = this.companyCollection.find(
                function (x) {
                    let result = x.company.find(n => n.name == "Company Name").value === localValue;
                    return result;
                }
            )

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