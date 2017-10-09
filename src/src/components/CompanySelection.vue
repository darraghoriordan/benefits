<template>
    <div class="form-group">
        <label for="companySelection">Select Company</label>
        <select @change="changeItem(rowId, $event)" class="form-control" id="companySelection">
            <option value="">Not in list</option>
            <option :value="item" v-for="item in companyNameList">
                {{ item }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'CompanySelection',
    props: {
        companyCollection: {
            type: Array,
            required: true
        }
    },

    data: function() {
        return {
            selected: 'selected',
            rowId: 10
        }
    },
    computed: {
        companyNameList: function() {
            let list = this.companyCollection.map(
                x => x.company.find(n => n.name == 'Company Name').value
            );
            return list;
        }
    },
    methods: {
        changeItem: function(rowId, event) {
            this.selected = `${rowId}, ${event.target.value}`
            this.$emit('selected', event.target.value)
        }
    }
}
</script>