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
            user: 'test',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            location: 'Glasgow',
            role: 'User'
        })
    }

    create(username, password, role, location){
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash){
            var entry = {user: username, password: hash, role: "User", location: location};
            that.db.insert(entry, function (err){
                if (err){
                    console.log("Can't insert user: ", username);
                }
                console.log(hash)
            });
        });
    } 
    
    lookup(user, cb){
        this.db.find({'user': user}, function (err, donations){
            if (err){
                return cb(null, null);
            } else {
                if(donations.length == 0){
                    return cb(null, null);
                } return cb(null, donations[0]);
            }
        });
    }
}

const dao = new UserDAO();
dao.init();
module.exports = dao;