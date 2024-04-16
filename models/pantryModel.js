const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
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
            password: '81e814e9310fedee29a23d28c87d397cafec8db2'
        })
    }

    create(username, password){
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash){
            var entry = {user: username, password: hash,};
            that.db.insert(entry, function (err){
                if (err){
                    console.log("Can't insert user: ", username);
                }
                console.log(hash)
            });
        });
    } 
    
    lookup(user, cb){
        this.db.find({'user': user}, function (err, entries){
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

const dao = new UserDAO();
dao.init();
module.exports = dao;