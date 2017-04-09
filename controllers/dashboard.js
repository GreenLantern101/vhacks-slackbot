var express = require('express'),
    app = require('../app.js'),
    router = express.Router();

//data as JSON
router.get('/data/messagefeed', function(req, res) {
    res.json({
        news: app.getMessages()
    });
})

router.get('/', function(req, res) {
    //front-end javascript client takes care of retrieving data from JSON page
    res.redirect('dashboard.html');
});

router.post('/', function(req, res) {

});
module.exports = router;
