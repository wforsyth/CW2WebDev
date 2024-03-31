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
}