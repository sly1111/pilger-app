const express = require('express');
const path = require('path');
const google = require('./helper/googleapi');

//express setup
const app = express();
app.set('views', path.join(__dirname, 'build'));
app.set('view engine', 'pug');
app.use(express.static('build'));
app.get('/', (req, res) => res.render('templates/index'));
app.set('port', process.env.PORT || 8080);
//app.get('/copyImages', (req, res) => google.getImages());
app.listen(app.get('port'), () =>
  console.log(`Listening on ${app.get('port')}`)
);