const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const path = require('path');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_DIR = path.resolve(__dirname) + '/../.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function getImages(isProd) {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(
    err,
    content
  ) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), listFiles, isProd);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, isProd) {
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
      callback(oauth2Client, isProd);
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

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth, isProd) {
  const service = google.drive('v3');
  const environment = (isProd)? 'live' : 'test';
  service.files.list(
    {
      auth: auth,
      pageSize: 1,
      orderBy: 'createdTime desc',
      q: 'mimeType="image/jpeg" and name contains "' + environment + '"',
      fields: 'nextPageToken, files(id, name)'
    },
    function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      const files = response.data.files;
      if (files.length == 0) {
        console.log('No files found in ' + environment + '.');
      } else {
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          fs.readdir(__dirname + '/../build/img/' + environment, function(error, data){
            if (error) {
              res.status(500).send(error);
              return;
            }
            if(data.includes(file.name)) {
              console.log('found image %s (%s) in ' + environment , file.name, file.id);    
            } else {
              console.log('write image %s (%s) in ' + environment, file.name, file.id);
              let fileId = 'file.id';
              let dest = fs.createWriteStream('build/img/' + environment + '/' + file.name);
              service.files.get(
                {
                  fileId: file.id,
                  alt: 'media',
                  auth: auth
                },
                {
                  responseType: 'stream'
                },
                function(err, response) {
                  response.data
                    .on('error', err => {
                      console.log('error');
                    })
                    .on('end', () => {
                      console.log('done');
                    })
                    .pipe(dest);
                }
              );
            }
          });
        }
      }
    }
  );
}

function removeImages(isProd) {
  const environment = (isProd)? 'live' : 'test'; 
  fs.readdir(__dirname + '/../build/img/' + environment + '/', (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(__dirname + '/../build/img/' + environment + '/', file), err => {
        if (err) throw err;
      });
    }
  });
}

module.exports = { removeImages, getImages };
