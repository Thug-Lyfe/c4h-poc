/**
 * Created by David on 02 May 2017.
 */
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require('../modules/user'); // get the mongoose model
var jwt = require('jwt-simple');

router.get("/names",function(req,res){
    res.json([{name: "Peter"}, {name: "Kurt"},{name: "Hanne"}]);
});

router.get("/hellos",function(req,res){
    res.json([{msg: "Hello World" }, {msg: "Hello all"},{msg: "Hello guys"}]);
});


router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, jwtConfig.secret);
        User.findOne({
            userName: decoded.userName
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.userName + '!'});
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