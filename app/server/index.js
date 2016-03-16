var express = require('express');
var process = require('process');
var os = require('os');

var stats = require('./stats');
var pjson = require('../../package.json');

var gamebot = require('../gamebot');

var server = {
    run: run
};

function run(port, storage) {
    var app = express();

    app.set('views', './app/server/views');
    app.set('view engine', 'jade');

    app.get('/', function (req, res) {
        var error = gamebot.getError();
        var uptime = formatUptime(process.uptime());
        var hostname = os.hostname();

        res.render('main', { error: error, uptime: uptime, server: hostname});
    });

    app.get('/stats', function(req, res) {
        var allUsers = stats.all(storage);
        res.render('stats', { users: allUsers });
    });

    app.get('/version', function(req, res) {
        res.status(200).send('Current version: ' + pjson.version);
    })

    app.get('/restart', function(req, res) {
        gamebot.restart();
        res.status(200).send('Gamebot restarted');
    })

    app.listen(port, function() {
      console.log('Server listening on port: '  + port);
    });
}

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}

module.exports = server;
