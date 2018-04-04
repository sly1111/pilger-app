const fs = require('fs');
const path = require('path');

function getPage(res, page) {
  fs.readdir(__dirname + '/../build/img/live', function(error, data){
    if (error) {
        res.status(500).send(error);
        return;
    }
    res.render('templates/index', {'files': data.reverse(), 'page': page});
  });
}

module.exports = { getPage };
