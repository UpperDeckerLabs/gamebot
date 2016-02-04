var connect = require('connect');
var serveStatic = require('serve-static');

var server = {
    run: run
};

function run(port, folder) {
    connect().use(serveStatic(folder)).listen(port);
    console.log('Server listening on port: '  + port);
}

module.exports = server;
