module.exports = UserData;

function UserData(userName, storage) {
    this.name = userName;
    this.data = null;
    this.storage = storage;

    this.loadData();
}

UserData.prototype.loadData = loadData;
UserData.prototype.getMoney = getMoney;
UserData.prototype.updateMoney = updateMoney;

function loadData() {
    this.data = this.storage.loadUser(this.name);
}

function getMoney() {
    return this.data.money;
}

function updateMoney(amount) {
    this.data.money += amount;
    this.storage.save(this.data);
}
