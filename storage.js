var Loki = require('lokijs');

// var Storage = {
//     loadUser: loadUser,
//     save: save
// }

function Storage(path) {
    this.db = null;
    this.users = null;
    this.initDB(path);
}

Storage.prototype.loadUser = loadUser;
Storage.prototype.initDB = initDB;
Storage.prototype.save = save;
Storage.prototype.createUserData = createUserData;
Storage.prototype.allUsers = allUsers;

module.exports = Storage;

function initDB(path) {
    // 'userData.json'
    this.db = new Loki(path, {
        autosave: true,
        autoload: true,
        autoloadCallback: _dbLoaded
    });
    var storage = this;
    function _dbLoaded() {
        storage.users = storage.db.getCollection('users');
        if (!storage.users) {
            storage.users = storage.db.addCollection('users');
        }
    }
}

function loadUser(userName) {
    var found = this.users.findOne({ name: userName});
    if (!found) {
        return this.createUserData(userName);
    }
    else {
        return found;
    }
}

function createUserData(userName) {
    var user = {
            name: userName,
            money: 1000
        };

    return this.users.insert(user);
}

function allUsers() {

    return this.users
        .chain()
        .simplesort('money', true)
        .data()
        .map(function(user) {
            return {
                name: user.name,
                value: user.money
            }
        });
}

function save() {
    this.db.save();
}
