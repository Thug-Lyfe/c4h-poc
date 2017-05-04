var express = require('express');
var router = express.Router();
var User = require('../modules/user'); // get the mongoose model
var jwt = require('jwt-simple');

const jwtConfig = require("../config/jwtConfig").jwtConfig;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', function(req, res) {
    if (!req.body.userName || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            userName: req.body.userName,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        userName: req.body.userName
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({ msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var iat = new Date().getTime()/1000; //convert to seconds
                    var exp = iat+jwtConfig.tokenExpirationTime;
                    var payload = {
                        aud: jwtConfig.audience,
                        iss: jwtConfig.issuer,
                        iat: iat,
                        exp: exp,
                        sub: user.userName
                    }
                    var token = jwt.encode(payload, jwtConfig.secret);
                    // return the information including token as JSON
                    res.json({user: user, token: 'JWT ' + token});
                } else {
                    res.status(401).send({ msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

module.exports = router;
