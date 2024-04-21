const nedb = require('gray-nedb');

class InventoryDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    init() {
        this.db.insert({
            pantry: 'Govan',
            food: 'Potatoes',
            quantity: '13',
            expiration: '16/06/24'
        });
    }

    //a function to return all entries from the database
    getAllInventory() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, inventory) {
                if (err) {
                    reject(err);
                } else {
                    resolve(inventory);
                    console.log('function all() returns: ', inventory);
                }
            })
        });
    }

    addInventory(pantry, food, quantity, expiration) {
        var inventory = {
            pantry: pantry,
            food: food,
            quantity: quantity,
            expiration: expiration
        };

        this.db.insert(inventory, function (err, doc) {
            if (err) {
                console.log('Error inserting document', err);
            } else {
                console.log('document inserted into database', doc);
                console.log(inventory);
            }
        });
    }

    removeInventory(inventoryId){
        this.db.remove({ '_id': inventoryId}, {}, (err) => {
            if (err){
                console.log("Error could not remove inventory");
            }
            console.log("Inventory removed")
        });
    }

    getInventoryByPantry(pantry){
        return new Promise((resolve, reject) => {
            this.db.find({'pantry': pantry}, function (err, inventory) {
                if (err) {
                    reject(err);
                } else {
                    resolve(inventory);
                    console.log('function all() returns: ', inventory);
                }
            })
        });  
    }
}

const dao = new InventoryDAO();
dao.init();
module.exports = dao;