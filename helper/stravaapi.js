const strava = require('strava-v3');
function testStrava (){
    strava.athlete.get({},function(err,payload,limits) {
        if(!err) {
            console.log(payload);
        }
        else {
            console.log(err);
        }
    });
}

module.exports = { testStrava };