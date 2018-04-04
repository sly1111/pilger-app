const fs = require('fs');
const path = require('path');
const strava = require('../helper/stravaapi');

async function getPage(res, page) {
  const stravaData = await strava.getActivities();
  console.log(stravaData);
  fs.readdir(__dirname + '/../build/img/live', function(error, data){
    if (error) {
        res.status(500).send(error);
        return;
    }
    res.render('templates/index', {'files': data.reverse(), 'page': page, 'stravaData': stravaData});
  });
}

module.exports = { getPage };
