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
        //user
        this.db.insert({
            pantry: 'GovanPantry',
            Location: 'Govan',
            password: '0f68f2eb2bd393ddb2db5d0ea80cfc01d26a5418',
            role: 'Pantry'
        }, (err, result) =>{
            if (err){
                console.log("Error inserting pantry information", err);
            } else{
                console.log("Pantry information insertedL", result)
            }
        });
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