const path = require('path')

exports.landing_page = function (req, res) {
    res.render('home', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
};