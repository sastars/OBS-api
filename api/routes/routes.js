'use strict';
module.exports = function(app) {
  var obsController = require('../obsController/obsController');


  app.route('/obs')
    .get(obsController.getobs)
    .put(obsController.putobs)
};
