Vue.use(VueMaterial);

var app = new Vue({
    el: '#mainfeed',
    data: {
        messages: []
    },
    methods: {

    }
});


function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};

function refresh() {
    getJSON('data/messagefeed', function(err, res) {
        //console.log(app.news);
        app.messages = res.messages;
    });
}
refresh();
