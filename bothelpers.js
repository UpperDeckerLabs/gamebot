var Promise = require('bluebird');

var Helpers = {
    getUserFromBot: getUserFromBot
};

module.exports = Helpers;

function getUserFromBot(bot,message) {
    return new Promise(function(resolve, reject) {
        bot.api.users.info({user:message.user}, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                resolve(data.user);
            }
        });
    });
}
