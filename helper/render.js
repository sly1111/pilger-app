const fs = require('fs');
const path = require('path');
const strava = require('../helper/stravaapi');

async function getPage(res, page) {
  let stravaJSON = fs.readFileSync(__dirname + '/../strava.json');
  const imgDir = (page === "testHome")? "test" : "live";
  stravaJSON = JSON.parse(stravaJSON);
  fs.readdir(__dirname + '/../build/img/'+imgDir, function(error, data){
    if (error) {
        res.status(500).send(error);
        return;
    }
    res.render('templates/index', {'files': data.reverse(), 'page': page, 'stravaData': stravaJSON.reverse()});
  });
}

module.exports = { getPage };
