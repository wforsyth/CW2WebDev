const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const donationDao = require('../models/donationModel.js');
const saltRounds = 10;

class PantryDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({
                filename: dbFilePath, autoload: true
            });
        } else {
            this.db = new Datastore();
        }
    }

    init() {
        this.db.insert({
            pantry: 'Govan',
            password: '$2a$10$REC78a99bqYwmsujHgC10uRZTyCmc6BdJ2Y5iXHHoVJNbqy/FozfC',
            location: 'Govan, Glasgow',
            role: 'Pantry',
            inventory: []
        })

        //pantry
        this.db.insert({
            pantry: 'Hillhead',
            password: '$2a$10$V/hJq2jGHhLJR.4m89y8PuBKu.8C3BvZBo9P2CoHLaYtQvJebCmUm',
            location: 'Hillhead, Glasgow',
            role: 'Pantry',
            inventory: []
        })

    }

    create(pantry, password, location, role, inventory){
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash){
            var entry = {pantry: pantry, password: hash, location: location, role: role, inventory: inventory};
            that.db.insert(entry, function (err){
                if (err){
                    console.log("Can't insert pantry: ", pantry);
                }
                console.log(hash)
            });
        });
    } 

    lookup(pantry, cb) {
        this.db.find({ 'pantry': pantry }, function (err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                } return cb(null, entries[0]);
            }
        });
    }

    delete(pantryId){
        this.db.remove({'_id': pantryId}, function (err){
            if(err){
                console.log('Error removing pantry')
            } 
            console.log("pantry", pantryId, "removed")
        });
    }

    receiveDonation(food, quantity, expiration, pantry) {
        var donation = {
            food: food,
            quantity: quantity,
            expiration: expiration
        }

        this.db.update({ _id: pantry}, { $push: { inventory: donation } }, {}, (err) => {
            if (err) {
                console.log('Error updating pantry inventory', err);
            } else {
                console.log('Pantry inventory successfully updated');
            }
        });
    }

    getAllPantries() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, pantry) {
                if (err) {
                    reject(err);
                } else {
                    resolve(pantry);
                    console.log('function all() returns: ', pantry);
                }
            })
        });
    }
}

const dao = new PantryDAO();
dao.init();
module.exports = dao;