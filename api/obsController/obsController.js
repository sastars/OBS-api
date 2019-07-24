'use strict';

var obsRequests = require('./obsRequests');

exports.getobs = function(req, res) {
  console.log(req.body);
  checkPassAndAddress(req.body,res,obsRequests.getobs);
}

exports.putobs = function(req, res) {
  console.log('put',req.body);
  checkPassAndAddress(req.body,res,obsRequests.setobs);
}


function checkPassAndAddress(body,res, callback){
  if(!body.hasOwnProperty('password')||!body.hasOwnProperty('address')||(!body.hasOwnProperty('request'))) {
    res.json({ message: 'all requests need to have an address and a password and a request field' });
  }else{
    callback(body,res);
  }
}
