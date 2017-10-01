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
            if (companyObjectX) {
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
            }

            if (companyObjectY) {
                for (var prop in companyObjectY[categoryName]) {
                    if (!companyObjectY[categoryName].hasOwnProperty(prop)) {
                        // not a specific property
                        continue;
                    }
                    let currentXProp = null
                    if (companyObjectX) {
                        let currentXCategory = companyObjectX[categoryName];
                        if (currentXCategory) {
                            currentXProp = companyObjectX[categoryName][prop];
                        }
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
    template: "#calculator-form-template",
    data: function () {
        return {
            salaryValue: 0,
        }
    },
    watch: {
        salaryValue: function (val, oldVal) {
            this.$emit('changeSalaryValue', val)
        }
    }
})
Vue.component('earningDifferenceVisualization', {
    template: "#earning-visualization",
    props: ['labels', 'companyOneDataset', 'companyTwoDataset', 'companyOneName', 'companyTwoName'],
    methods: {
        makeVisualisation: function () {
            this.chartInstance = new Chart(this.$el, {
                type: 'line',
                data: {
                    labels: this.labels,
                    datasets: [{
                        data: this.companyOneDataset.map(x => x.value),
                        label: this.companyOneName,
                        borderColor: "#3e95cd",
                        fill: false
                    }, {
                        data: this.companyTwoDataset.map(x => x.value),
                        label: this.companyTwoName,
                        borderColor: "#8e5ea2",
                        fill: false
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Potential future earnings'
                    }
                }
            });
        }
    },
    mounted: function () {
        this.makeVisualisation();
    },
    watch: {
        companyOneDataset: function () {
            this.makeVisualisation();
        },
        companyTwoDataset: function () {
            this.makeVisualisation();
        },
        companyOneName: function () {
            this.makeVisualisation();
        },
        companyTwoName: function () {
            this.makeVisualisation();
        }
    },
    data: function () {
        return {
            chartInstance: null
        }
    }
});
Vue.component('calculator-results', {
    template: "#calculator-results-template",
    data: function () {
        return {
            salaryFuture: [],
            totalEarned: 0
        };
    },
    props: ['salaryValue'],
    watch: {
        salaryValue: function () {
            let value = this.salaryValue;

            this.salaryFuture = [];

            let kiwisaverPercent = 0.03;
            this.salaryFuture.push({
                year: 1,
                value: Math.floor(value + ((kiwisaverPercent * value)))
            })
            //calc a 3% raise each year
            for (i = 1; i < 10; i++) {
                let thisYearSalary = Math.floor(value * (Math.pow((1 + (.03 + kiwisaverPercent) / 1), i)))
                this.salaryFuture.push({
                    year: 1 + i,
                    value: thisYearSalary
                })
            }

            this.totalEarned = this.salaryFuture.reduce(
                function (accumulator, currentValue) {
                    return accumulator + currentValue.value;
                }, 0
            )
            this.$emit('changeSalaryFuture', this.salaryFuture)
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
    template: `<div class="form-group">
                <label for="companySelection">Select Company</label>   
                <select @change="changeItem(rowId, $event)" class="form-control" id="companySelection">
                <option value="">Not in list</option>
                <option :value="item" v-for="item in companyNameList">
                {{ item }}
                </option>
                </select></div> `,
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
        rightThing: {},
        leftSalary: 0,
        rightSalary: 0,
        graphLabels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"],
        companyOneDataset: [],
        companyTwoDataset: [],
        companyOneName: "",
        companyTwoName: ""
    },
    created: function () {
        this.loadData()
    },
    methods: {
        changeLeftSalaryFuture: function (value) {
            this.companyOneDataset = value;
        },
        changeRightSalaryFuture: function (value) {
            this.companyTwoDataset = value;
        },
        changeLeftSalaryValue: function (value) {
            this.leftSalary = value;
        },
        changeRightSalaryValue: function (value) {
            this.rightSalary = value
        },
        selectedLeft: function (value) {
            let localValue = value;
            this.leftThing = this.companyCollection.find(
                function (x) {
                    let result = x.company.find(n => n.name == "Company Name").value === localValue;
                    return result;
                })
            let foundName = '';
            if (this.leftThing) {
                foundName = this.leftThing.company.find(n => n.name == "Company Name").value
            }
            this.companyOneName = foundName;
        },
        selectedRight: function (value) {
            let localValue = value;
            this.rightThing = this.companyCollection.find(
                function (x) {
                    let result = x.company.find(n => n.name == "Company Name").value === localValue;
                    return result;
                }
            )
            let foundName = '';
            if (this.rightThing) {
                foundName = this.rightThing.company.find(n => n.name == "Company Name").value
            }
            this.companyTwoName = foundName;
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