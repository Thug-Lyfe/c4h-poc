/**
 * Created by David on 02 May 2017.
 */
var express = require("express");
var router = express.Router();
//var passport = require("passport");
var User = require('../modules/user'); // get the mongoose model
//var jwt = require('jwt-simple');

router.get("/names",function(req,res){
    res.json([{name: "Peter"}, {name: "Kurt"},{name: "Hanne"}]);
});

router.get("/hellos",function(req,res){
    res.json([{msg: "Hello World" }, {msg: "Hello all"},{msg: "Hello guys"}]);
});

router.get("/search/profession",function (req,res) {
    User.find({})
        .exec(function (err, list) {
            if(err){
                res.send(err);
            }else {
                res.json(list);
            }
        })
});



module.exports = router;