const fs = require('fs');
const path = require('path');

function getFileNames(res) {
  fs.readdir(__dirname + '/../build/img/live', function(error, data){
    if (error) {
        res.status(500).send(error);
        return;
    }
    res.render('templates/index', {"files": data});
  });
}

module.exports = { getFileNames };
