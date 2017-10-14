<template>
    <div style="">
        <div v-for="entry in comparisonTable">
            <h3>{{ entry.name }}</h3>
            <table class="table is-bordered is-striped is-narrow">
                <tbody>
                    <tr v-for="field in entry.fields">
                        <td>
                            {{ field.name }}
                        </td>
                        <td>
                            {{ field.valueX }}
                        </td>
                        <td>
                            {{ field.valueY }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComparisonGrid',
    methods: {
        getCategoryNameCollection: function(companyX, companyY) {
            let categoryNameCollection = []

            for (var key in companyX) {
                if (!companyX.hasOwnProperty(key)) {
                    continue
                }
                categoryNameCollection.push(key)
            }
            for (var ykey in companyY) {
                if (!companyY.hasOwnProperty(ykey)) {
                    continue
                }
                if (categoryNameCollection.find(
                    function(element) {
                        return element === ykey
                    }
                )) {
                    continue
                }
                categoryNameCollection.push(ykey)
            }

            return categoryNameCollection
        },
        calcualteDisplayValue: function(prop) {
            if (!prop) {
                return 'Unknown'
            }
            if (prop.type === 'bool') {
                if (prop.value === 'true') {
                    return 'Yes'
                }
                return 'No'
            }
            if (prop.type === 'fixedAmount') {
                return '$' + prop.value
            }
            if (prop.type === 'percent') {
                return prop.value + '%'
            }

            return prop.value
        },
        getFields: function(companyObjectX, companyObjectY, categoryName) {
            let fieldList = []
            if (companyObjectX) {
                for (var prop in companyObjectX[categoryName]) {
                    if (!companyObjectX[categoryName].hasOwnProperty(prop)) {
                        continue
                    }
                    let currentXProp = companyObjectX[categoryName][prop]
                    let newCombinedProp = {}
                    newCombinedProp.name = currentXProp.name
                    newCombinedProp.valueX = this.calcualteDisplayValue(currentXProp)

                    if (companyObjectY && companyObjectY[categoryName]) {
                        let currentYProp = companyObjectY[categoryName].find(x => x.name === currentXProp.name)
                        if (!currentYProp) {
                            newCombinedProp.valueY = 'Unknown'
                        } else {
                            newCombinedProp.valueY = this.calcualteDisplayValue(currentYProp)
                        }
                    } else {
                        newCombinedProp.valueY = 'Unknown'
                    }

                    fieldList.push(newCombinedProp)
                }
            }

            if (companyObjectY) {
                for (var yprop in companyObjectY[categoryName]) {
                    if (!companyObjectY[categoryName].hasOwnProperty(yprop)) {
                        // not a specific property
                        continue
                    }
                    let currentXProp = null
                    if (companyObjectX) {
                        let currentXCategory = companyObjectX[categoryName]
                        if (currentXCategory) {
                            currentXProp = companyObjectX[categoryName][yprop]
                        }
                    }
                    if (!currentXProp) {
                        let currentYProp = companyObjectY[categoryName][yprop]

                        let newCombinedProp = {}
                        newCombinedProp.name = currentYProp.name
                        newCombinedProp.valueY = this.calcualteDisplayValue(currentYProp)
                        newCombinedProp.valueX = 'Unknown'

                        fieldList.push(newCombinedProp)
                    }
                }
            }

            return fieldList
        }
    },
    props: {
        leftCompany: {},
        rightCompany: {}
    },
    computed: {
        comparisonTable: function() {
            let combinedData = []

            this.getCategoryNameCollection(this.leftCompany, this.rightCompany).forEach(function(element) {
                let category = {}
                category.name = element
                category.fields = this.getFields(this.leftCompany, this.rightCompany, category.name)

                combinedData.push(category)
            }, this)

            return combinedData
        }

    }
}
</script>