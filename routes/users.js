var express = require('express');
var router = express.Router();
var User = require('../modules/user'); // get the mongoose model
var jwt = require('jwt-simple');
var multer = require('multer');
var passport = require("passport");
var path = require('path');

const jwtConfig = require("../config/jwtConfig").jwtConfig;

var storage = multer.diskStorage({
    destination: './public/images/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
    }
});

var m = multer({ storage: storage });
var upload = m.single('file');

router.post('/signup', function(req, res) {
    if (!req.body.email || !req.body.password || !req.body.displayName) {
        res.json({success: false, msg: 'Please pass email and password.'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Email/Displayname already exists.', err: err});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        email: req.body.email
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
                        sub: user.email,
                        usr: user.displayName
                    };
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

router.put('/editprofile', passport.authenticate('jwt', { session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, jwtConfig.secret);
        User.findOneAndUpdate({email: decoded.sub}, req.body, {new: true},
            function(err, user) {
                if (err) throw err;
                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    res.json({success: true, msg: 'Profile saved for: ' + req.body.displayName + '!'});
                    console.log(req.body);
                }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

router.post('/upload/profilepic', passport.authenticate('jwt', { session: false}), function(req, res) {

    upload(req, res, function (err) {
        if(err){
            console.log(err);
        }
        else {
            var file = req.file;
            if(!file){
                return res.status(403).send({success: false, msg: 'No image provided.'});
            }
            var token = getToken(req.headers);
            if (token) {
                var decoded = jwt.decode(token, jwtConfig.secret);
                User.findOneAndUpdate(
                    {email: decoded.sub},
                    {profilePic: "/images/uploads/" + file.filename},
                    {new: true},
                    function(err, user) {
                        if (err) throw err;

                        if (!user) {
                            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                        } else {
                            res.json({success: true, msg: 'Profile picture uploaded.'});
                        }
                    });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});
            }
        }

    });


});

router.post('/upload/coverpic', passport.authenticate('jwt', { session: false}), function(req, res) {

    upload(req, res, function (err) {
        if(err){
            console.log(err);
        }
        else {
            var file = req.file;
            if(!file){
                return res.status(403).send({success: false, msg: 'No image provided.'});
            }
            var token = getToken(req.headers);
            if (token) {
                var decoded = jwt.decode(token, jwtConfig.secret);
                User.findOneAndUpdate(
                    {email: decoded.sub},
                    {coverPic: "/images/uploads/" + file.filename},
                    {new: true},
                    function(err, user) {
                        if (err) throw err;

                        if (!user) {
                            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                        } else {
                            res.json({success: true, msg: 'Profile picture uploaded.'});
                        }
                    });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});
            }
        }

    });


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
