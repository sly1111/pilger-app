const strava = require('strava-v3');

function getActivities (){
    const opts = { 
        'after': 1522479600, // {Integer} An epoch timestamp to use for filtering activities that have taken place after a certain time.
        'perPage': 32 // {Integer} Number of items per page. Defaults to 30.
      };
      const callback = function(err, data, response) {
        if (!err) {
            console.log('2');
            return data;
        } else {
            console.error(err);
        }
      };
      return strava.athlete.listActivities(opts, callback);
    // strava.athlete.get({},function(err,payload,limits) {
    //     if(!err) {
    //         console.log(payload);
    //     }
    //     else {
    //         console.log(err);
    //     }
    // });

}

module.exports = { getActivities };