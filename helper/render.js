const fs = require('fs');
const path = require('path');
const strava = require('../helper/stravaapi');

async function getPage(res, page) {
  let stravaJSON = fs.readFileSync(__dirname + '/../strava.json');
  stravaJSON = JSON.parse(stravaJSON);
  fs.readdir(__dirname + '/../build/img/live', function(error, data){
    if (error) {
        res.status(500).send(error);
        return;
    }
    res.render('templates/index', {'files': data.reverse(), 'page': page, 'stravaData': stravaJSON.reverse()});
  });
}

module.exports = { getPage };
