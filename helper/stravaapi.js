const strava = require('strava-v3');

function getActivities (){
    return new Promise(function(resolve, reject) {
        const opts = { 
            'after': 1524268801, // {Integer} An epoch timestamp to use for filtering activities that have taken place after a certain time.
            'perPage': 32 // {Integer} Number of items per page. Defaults to 30.
        };
        const callback = function(err, data, response) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        };
        strava.athlete.listActivities(opts, callback);
    });
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