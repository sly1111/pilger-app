// node modules
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/build'));

app.set('view engine');
app.set('port', process.env.PORT || 8080);

app.get('/', (req, res) => {
  res.render('home');
});

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.listen(app.get('port'), () => {
  console.log('Express Server Started');
});