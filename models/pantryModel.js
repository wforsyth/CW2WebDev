const Datastore = require("gray-nedb");
const bcrypt = require('bcryptjs');
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
        })

        this.db.insert({
            pantry: 'Whiteinch',
            password: '$2a$10$T3PwHF7yu1e/ckt2dxkLGeJjdS9xQtYDYJxm99ntL9rJYM7Wolybu',
            location: '1 Northinch St, Glasgow',
            role: 'Pantry',
        });

        this.db.insert({
            pantry: 'Falkirk',
            password: '$2a$10$RJ3kp7eP0m923.G1xeEJQe3AkzJovto4cJbuB6oZHEWdVfoRKBIHS',
            location: 'Falkirk, Glasgow',
            role: 'Pantry',
        });

        this.db.insert({
            pantry: 'Courtyard',
            password: '$2a$10$.4lJIKjpJ3QnFOzmO.EdIedUy3ah1ABa3kK0ukxi7FVPgqoy8qkVS',
            location: '2 Wester Common Dr, Glasgow',
            role: 'Pantry',
        });

        this.db.insert({
            pantry: 'Pollok',
            password: '$2a$10$XczCYpbnWPfQvoAXk5RaYe1jHgqJztVcxa96ucVwTg9uIKPEdV5aS',
            location: '25 Brockburn Rd, Glasgow',
            role: 'Pantry',
        });

        this.db.insert({
            pantry: 'Croftpark',
            password: '$2a$10$/fkrwvLe3X3erQ6vzbEHEeu37q6XeqktXL3jajWL5zd0Rct075ra.',
            location: 'Crofthill Rd, Glasgow',
            role: 'Pantry',
        });

    }

    create(pantry, password, location, role, inventory) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var entry = { pantry: pantry, password: hash, location: location, role: role, inventory: inventory };
            that.db.insert(entry, function (err) {
                if (err) {
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

    delete(pantryId) {
        this.db.remove({ '_id': pantryId }, function (err) {
            if (err) {
                console.log('Error removing pantry')
            }
            console.log("pantry", pantryId, "removed")
        });
    }

    /*receiveDonation(food, quantity, expiration, pantryId) {

        var donation = {
            food: food,
            quantity: quantity,
            expiration: expiration
        }

        this.db.update({ '_id': pantryId }, { $push: { 'inventory': donation } }, {}, function (err) {
            if (err) {
                console.log('Error receiving donation', err);
            } else {
                console.log('Pantry inventory successfully updated with donation:', donation);
            }
        });
    }*/

    /*receiveDonation(food, quantity, expiration, pantryId, callback){
        var donation={
            food: food,
            quantity: quantity,
            expiration: expiration
        }
        this.db.update({'_id': pantryId},{$push: {'inventory': donation}}, function(err){
            if (err) {
                console.log('Error updating inventory');
                callback(err);
            } else{
                console.log("pantry inventory updated with: ", donation);
                callback(null);
            }  
        })
    }*/

    receiveDonation(donation, pantryId, callback){
        this.db.update({'_id': pantryId},{$set: {'inventory': donation}}, function(err){
            if (err) {
                console.log('Error updating inventory');
                callback(err);
            } else{
                console.log("pantry inventory updated with: ", donation);
                callback(null);
            }  
        })
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