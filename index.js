const express = require('express');
const path = require('path');
const google = require('./helper/googleapi');
const strava = require('./helper/stravaapi');
const render = require('./helper/render');
const cron = require('node-cron');

//express setup
const app = express();
app.set('views', path.join(__dirname, 'build'));
app.set('view engine', 'pug');
app.use(express.static('build'));
app.get('/', (req, res) => render.getPage(res, 'carousel'));
app.get('/gallery', (req, res) => render.getPage(res, 'gallery'));
app.get('/s4wFG0bQmRvQREvb1PUW', (req, res) => google.removeImages());
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () =>
console.log(`Listening on ${app.get('port')}`)
);

cron.schedule('* * * * *', function(){
  //google.getImages();
});