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
            location: 'Glasgow',
            foodName: 'Potatoes',
            quantity: '13',
            expiration: '16/06/24'
        });

        console.log('Information added to database');
    }

    //a function to return all entries from the database
    getAllDonations() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, donations) {
                if (err) {
                    reject(err);
                } else {
                    resolve(donations);
                    console.log('function all() returns: ', donations);
                }
            })
        });
    }

    addDonation(user, location, foodName, quantity, expiration) {

        var donation = {
            user: user,
            location: location,
            foodName: foodName,
            quantity: quantity,
            expiration: expiration
        }
        this.db.insert(donation, function (err, doc) {
            if (err) {
                console.log('Error inserting document', err);
            } else {
                console.log('document inserted into database', doc);
            }
        });
    }

    getDonationByUser(user) {
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