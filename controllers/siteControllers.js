const path = require('path')

exports.landing_page = function (req, res) {
    res.render('home', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
};

exports.show_login_page = function (req, res){
    res.render('user/login',{
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};

exports.show_register_page = function (req, res){
    res.render('user/register',{
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};
