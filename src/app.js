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
                <option>select item</option>
                <option :value="item.company.name"  v-for="item in companyCollection">
                {{item.company.name}}
                </option>
                </select>`,
    methods: {
        changeItem: function (rowId, event) {
            this.selected = `${rowId}, ${event.target.value}`
        }
    }
});

new Vue({
    el: '#appContainer',
    template: '<div><button v-on:click="loadData()">load</button><company-selection :company-collection="companyCollection"></company-selection></div>',
    data: {
        companyCollection: [],
    },
    methods: {
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