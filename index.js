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
app.get('/gallery', (req, res) => render.getPage(res, 'gallery'));
app.get('/s4wFG0bQmRvQREvb1PUW', (req, res) => google.removeImages());
app.set('port', process.env.PORT || 8080);
//app.get('/copyImages', (req, res) => getImages());
app.listen(app.get('port'), () => console.log(`Listening on ${ app.get('port') }`));
function getImages() {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), listFiles);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];

  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}


/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

cron.schedule('* * * * *', function(){
  google.getImages();
});

cron.schedule('15 * * * *', function(){
  const data = async () => {
    let activities = await strava.getActivities();
    return JSON.stringify(activities);
  }
  data().then((activities) => {
    fs.writeFile('strava.json', activities);
    console.log('write Strava Activities');
  })
});
