const strava = require('strava-v3');

function getActivities (isProd){
    return new Promise(function(resolve, reject) {
        const timestamp = (isProd)? '1524268801' : '1514761200'
        const opts = { 
            'after': timestamp, // {Integer} An epoch timestamp to use for filtering activities that have taken place after a certain time.
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
}

module.exports = { getActivities };