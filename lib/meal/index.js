'use strict';

var parseDate = require('../date-parse')
var find_meals = require('./history');
var sum = require('./total');

function generate (inputs) {

  var treatments = find_meals(inputs);

  var opts = {
    treatments: treatments
  , profile: inputs.profile
  , pumphistory: inputs.history
  , glucose: inputs.glucose
  , basalprofile: inputs.basalprofile
  };

  var clock = parseDate(inputs.clock);

  return /* meal_data */ sum(opts, clock);
}

exports = module.exports = generate;
