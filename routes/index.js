var express = require('express');
//var Admin    = require('../schema/admins');
var router = express.Router();
var admin = {
        email: "admin@gmail.com",
        password: "admin123",
        is_admin: true
    };
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mongodb Management' });
});
/***
 * Run it into rest client after starting the project to create a new admin account
 */


/***** Admin login*/
router.post('/', function (req, res) {
    console.log(admin);
    if(admin.email == req.body.email && admin.password == req.body.password){
        adminDet = {
            email: req.body.email,
            is_admin: true,
            authenticated: true
        };
        req.session.admin = adminDet;
        res.redirect('/mongo');
    }
    else{
       res.redirect('/'); 
    }
});
module.exports = router;
