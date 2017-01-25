var csv = require('csv-to-json');
const express = require('express');
const mustacheExpress = require('mustache-express');

app = express();



var obj = {
    filename: __dirname+'/streams/bear/log.csv',
    separator:',' // optional default is set to ,
};

csv.parse(obj,(err,json)=>{
  console.log(json);
});


app.use(express.static(__dirname + '/public'));
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.set('partials', __dirname+ '/views/partials');

//get "home" / root
app.get('/', (req,res,next)=>{
  res.render('test');
  //next();
});
