// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
    methods: {
        getCategoryNameCollection: function (companyX, companyY) {
            let categoryNameCollection = [];

            for (var key in companyX) {
                if (!companyX.hasOwnProperty(key)) {
                    continue;
                }
                categoryNameCollection.push(key);
            }
            for (var key in companyY) {
                if (!companyY.hasOwnProperty(key)) {
                    continue;
                }
                if (categoryNameCollection.find(
                        function (element) {
                            return element == key;
                        }
                    )) {
                    continue;
                }
                categoryNameCollection.push(key);
            }

            return categoryNameCollection;
        },
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

            for (var prop in companyObjectX[categoryName]) {
                if (!companyObjectX[categoryName].hasOwnProperty(prop)) {
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

            if (companyObjectY) {
                for (var prop in companyObjectY[categoryName]) {
                    if (!companyObjectY[categoryName].hasOwnProperty(prop)) {
                        // not a specific property
                        continue;
                    }
                    let currentXProp = null
                    let currentXCategory = companyObjectX[categoryName];
                    if (currentXCategory) {
                        currentXProp = companyObjectX[categoryName][prop];
                    }
                    if (!currentXProp) {
                        let currentYProp = companyObjectY[categoryName][prop];

                        let newCombinedProp = {};
                        newCombinedProp.name = currentYProp.name;
                        newCombinedProp.valueY = currentYProp.value;
                        newCombinedProp.valueX = "Unknown";

                        fieldList.push(newCombinedProp);
                    }
                }
            }

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

            this.getCategoryNameCollection(this.leftCompare, this.rightCompare).forEach(function (element) {
                let category = {};
                category.name = element;
                category.fields = this.getFields(this.leftCompare, this.rightCompare, category.name)

                combinedData.push(category);
            }, this);

            return combinedData;
        }

    }
})
Vue.component('calculator-form', {
    template:"#calculator-form-template",

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
                <option value="">Select a company</option>
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