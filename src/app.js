// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
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
                <option disabled value="">select a company</option>
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