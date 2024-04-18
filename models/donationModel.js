const nedb = require('gray-nedb');

class DonationDAO {
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
            user: 'test',
            foodName: 'Potatoes',
            quantity: '13',
            expiration: '16/06/24'
        });

        console.log('Information added to database');
    }

    //a function to return all entries from the database
    getAllEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            this.db.find({}, function (err, donations) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(donations);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', donations);
                }
            })
        });
    }

    addDonation(user, foodName, quantity, expiration) {

        var donation = {
            user: user,
            foodName: foodName,
            quantity: quantity,
            expiration: expiration
        }
        console.log('donation created', donation);
        this.db.insert(donation, function (err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into database', doc);
            }
        });
    }

    getEntriesByUser(user) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'user': user }, function (err, donation) {
                if (err) {
                    reject(err);
                } else {
                    resolve(donation);
                    console.log('getEntriesByUser returns: ', donation);
                }
            })
        });
    }
}

const dao = new DonationDAO();
dao.init();
module.exports = dao;