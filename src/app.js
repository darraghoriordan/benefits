new Vue({
    el: '#appContainer',

    data: {
        outputString: ''
    },
    methods: {
        loadData: function () {
            var ctrl = this;
            axios.get('/src/data.json', {
                    "encodingType": "UTF8"
                })
                .then(function (response) {
                    ctrl.outputString = JSON.stringify(response.data.data);
                });
        }
    }
});