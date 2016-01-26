var process = require('process');

var token = process.env.SLACK_TOKEN ? process.env.SLACK_TOKEN : 'YOUR_TOKEN_HERE';

if (token === 'YOUR_TOKEN_HERE') {
    throw new Error('You forgot to define your token.');
}

module.exports = token;
