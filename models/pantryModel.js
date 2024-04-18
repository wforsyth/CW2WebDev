const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class PantryDAO {
    constructor(dbFilePath){
        if(dbFilePath){
            this.db = new Datastore({
                filename: dbFilePath, autoload: true
            });
        } else {
            this.db = new Datastore();
        }
    }

    init(){
        this.db.insert({
            pantry: 'Govan',
            password: '$2a$10$REC78a99bqYwmsujHgC10uRZTyCmc6BdJ2Y5iXHHoVJNbqy/FozfC',
            location: 'Govan, Glasgow',
            role: 'Pantry'
        })

        //pantry
        this.db.insert({
            pantry: 'Hillhead',
            password: '$2a$10$V/hJq2jGHhLJR.4m89y8PuBKu.8C3BvZBo9P2CoHLaYtQvJebCmUm',
            location: 'Hillhead, Glasgow',
            role: 'Pantry'
        })

    }
    
    lookup(pantry, cb){
        this.db.find({'pantry': pantry}, function (err, entries){
            if (err){
                return cb(null, null);
            } else {
                if(entries.length == 0){
                    return cb(null, null);
                } return cb(null, entries[0]);
            }
        });
    }
}

const dao = new PantryDAO();
dao.init();
module.exports = dao;