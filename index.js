const express = require('express');
const path = require('path');
const google = require('./helper/googleapi');
const strava = require('./helper/stravaapi');
const render = require('./helper/render');
const cron = require('node-cron');
const fs = require('fs');

//express setup
const app = express();
app.set('views', path.join(__dirname, 'build'));
app.set('view engine', 'pug');
app.use(express.static('build'));
app.get('/', (req, res) => render.getPage(res, 'home'));
app.get('/test9134', (req, res) => render.getPage(res, 'testHome'));
app.get('/testGallery9134', (req, res) => render.getPage(res, 'testGallery'));
app.get('/gallery', (req, res) => render.getPage(res, 'gallery'));
app.get('/s4wFG0bQmRvQREvb1PUW', (req, res) => {
  google.removeImages(true);
  google.removeImages(false);
});
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => console.log(`Listening on ${ app.get('port') }`));

/*cron.schedule('20 * * * * *', function(){
  google.getImages(true);
  google.getImages(false);
});*/

/*cron.schedule('0,20,40 * * * *', function(){
  const data = async () => {
    let activities = await strava.getActivities(true);
    if(activities.length > 0) {
      return JSON.stringify(activities);
    } else {
      return JSON.stringify([]);
    }
  }
  data().then((activities) => {
    fs.writeFile('strava.json', activities);
    console.log('write Strava Activities');
  })
  const testData = async () => {
    let testActivities = await strava.getActivities(false);
    if(testActivities.length > 0) {
      return JSON.stringify(testActivities);
    } else {
      return JSON.stringify([]);
    }
  }
  testData().then((testActivities) => {
    fs.writeFile('stravaTest.json', testActivities);
    console.log('write Strava Test Activities');
  })
});*/
