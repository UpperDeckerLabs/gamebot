var path = require('path');
var process = require('process');

var Gamebot = require('./app/gamebot');
var Server = require('./app/server');
var Storage = require('./app/storage');
var token = require('./app/token');
var storage = new Storage('userData.json');

var port = process.env.PORT ? process.env.PORT : 8080;
Server.run(port, storage);

Gamebot.start(storage, token);
