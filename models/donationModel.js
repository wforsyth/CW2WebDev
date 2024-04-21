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

    //initiates test donation
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

    //function to return all donations from the database
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

    //function to get donation from database based on its ID
    getDonationById(donationId){
        return new Promise((resolve, reject) =>{
            this.db.find({_id: donationId}, function (err, donation){
                if(err){
                    reject(err);
                } else{
                    resolve(donation);
                    console.log('getDOnationById returns: ', donation);
                }
            })
        })
    }

    //function to add donation to database
    addDonation(user, location, foodName, quantity, expiration) {

        var donation = {
            user: user,
            location: location,
            foodName: foodName,
            quantity: quantity,
            expiration: expiration
        };

        this.db.insert(donation, function (err, doc) {
            if (err) {
                console.log('Error inserting document', err);
            } else {
                console.log('document inserted into database', doc);
            }
        });
    }

    //function to remove donation from database based on ID
    removeDonation(donationId){
        this.db.remove({ '_id': donationId}, {}, (err) => {
            if (err){
                console.log("Error could not remove donation");
            }
            console.log("Donation removed")
        });
    }
}

const dao = new DonationDAO();
dao.init();
module.exports = dao;