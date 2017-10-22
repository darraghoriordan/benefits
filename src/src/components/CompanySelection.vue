<template>
    <div class="field is-horizontal">
        <div class="field-label is-small">
            <label class="label">Select Company</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <div class="select is-fullwidth">
                        <select @change="changeItem(rowId, $event)" ref="companySelection">
                            <option value="">Not in list</option>
                            <option :value="item" v-for="item in companyNameList">
                                {{ item }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
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
                x => x.company.find(n => n.name === 'Company Name').value
            )
            return list
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