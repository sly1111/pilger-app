// node modules
const express = require('express');
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
const app = express();

app.engine('handlebars', handlebars.engine);
app.use(express.static(__dirname + '/frontend'));

app.set('view engine', 'handlebars');
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
