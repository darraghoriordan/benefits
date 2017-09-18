new Vue({
    el: '#appContainer',

    data: {
        allData: ''
    },
    methods: {
        loadData: function () {
            axios.get('/src/data.json', {
                    "encodingType": "UTF8"
                })
                .then(function (response) {
                    allData =JSON.stringify(response.data.data);
                });
        }
    }
});