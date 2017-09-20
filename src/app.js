// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        headers: Array,
        data: Array
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
    template: '<div><company-selection @selected="selectedLeft" :company-collection="companyCollection"></company-selection><company-selection @selected="selectedRight" :company-collection="companyCollection"></company-selection><demo-grid></demo-grid></div>',
    data: {
        companyCollection: [],
    },
    created: function () {
        this.loadData()
    },
    methods: {
        selectedLeft: function (value) {
            console.log(value);
        },
        selectedRight: function (value) {
            console.log(value);
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