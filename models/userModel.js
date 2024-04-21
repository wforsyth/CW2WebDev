const Datastore = require("gray-nedb");
const bcrypt = require('bcryptjs');
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

    //initiates test user
    init(){
        this.db.insert({
            user: 'test',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            location: 'Glasgow',
            role: 'User'
        })
    }

    //function to create user
    create(username, password, role, location){
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash){
            var entry = {user: username, password: hash, role: role, location: location};
            that.db.insert(entry, function (err){
                if (err){
                    console.log("Can't insert user: ", username);
                }
                console.log(hash)
            });
        });
    } 
    
    //function to search for user
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

    //function to delete user based on ID
    delete(userId){
        this.db.remove({'_id': userId}, function (err){
            if(err){
                console.log('Error removing user')
            } 
            console.log("user", userId, "removed")
        })
    }

    //function to get all users from database
    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                    console.log('function all() returns: ', user);
                }
            })
        });
    }
}

const dao = new UserDAO();
dao.init();
module.exports = dao;