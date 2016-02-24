var express = require('express');
var stats = require('./stats');

var server = {
    run: run
};

function run(port, storage) {
    var app = express();

    app.set('views', './app/server/views');
    app.set('view engine', 'jade');

    app.get('/', function (req, res) {
        res.send('Gamebot is running!');
    });

    app.get('/stats', function(req, res) {
        var allUsers = stats.all(storage);
        res.render('stats', { users: allUsers });
    });

    app.listen(port, function() {
      console.log('Server listening on port: '  + port);
    });
}

module.exports = server;
