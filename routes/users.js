var express = require('express');
var router = express.Router();
var User = require('../modules/user'); // get the mongoose model
var jwt = require('jwt-simple');
var multer = require('multer');
var passport = require("passport");

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

router.put('/editprofile/:id', function (req, res) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode - (token, jwtConfig.secret);
        if (decoded.userName == req.params.userName) {
            User.findOneAndUpdate({userName: decoded.userName}, req.body, {new: true}, function (err, user) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(user);
                }
            })
        } else {
            res.send("Log on to your own account bitch");
        }
    } else {
        res.status(401).send({msg: 'Login to edit profile.'});
    }
});

router.post('/upload/profilepic',passport.authenticate('jwt', { session: false}), multer({dest: '../public/images/uploads'}).single('upl'), function(req, res) {
    var file = req.file;

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, jwtConfig.secret);
        User.findOneAndUpdate(
            {userName: decoded.sub},
            {profilePic: "tets"},
            {new: true},
            function(err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    console.log("uploaded");
                    console.log(req.file);
                    res.json({success: true, msg: 'Profile picture uploaded.'});
                }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
