const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class AdminDAO {
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
            admin: 'Admin',
            password: '$2a$10$hjqi3IJrApHs/pQbMeUisury9GJO.PpEdMBgL0rhNTQHM3V77ousq',
            role: 'Admin'
        })
    }
    
    lookup(admin, cb){
        this.db.find({'admin': admin}, function (err, entries){
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

const dao = new AdminDAO();
dao.init();
module.exports = dao;