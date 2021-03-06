//require needed packages
//express stuff
const express = require('express');
const mustacheExpress = require('mustache-express');
//file/data transformation tools
const jsonfile = require('jsonfile');
const json2csv = require('json2csv');
const csv2json = require('csv-to-json');
const csvJSON = require('simpleCsvToJson');
const fileSys = require('fs');
//path creation/transformation
const path = require('path');
//for parsing reqest bodies
const bodyParser = require('body-parser');
//random key generator
const keygen = require("keygenerator");
//rm -r tool
const rmdir = require("rimraf");

//create instance of express
const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
/*
app.use(favicon(path.join(__dirname+'/public/img/favicon.ico'), {
      maxAge: 2592000000
    }));
*/

app.use(express.static(__dirname + '/public'));
app.use('/streams',express.static(__dirname + '/streams'));
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.set('partials', __dirname+ '/views/partials');

//get "home" / root
app.get('/', (req,res,next)=>{
  res.render('home');
  //next();
});

app.get('/docs', (req,res)=>{
  res.render('docs');
});

//get call to streams/create
app.get('/streams/create', (req,res,next)=>{
  //send GUI form page for creating a stream
  res.render('create');
  //res.end('Future create GUI');
  //next();
});

app.get('/streams/view/:name', (req,res,next)=>{
  fileSys.readFile(path.join(__dirname+'/streams/'+req.params.name +'/log.csv'), (err,data)=>{
  if(err){
    console.log(err);
  }
   //test csv to array

   //parse array objects to mustache data
   //respond with mustache data

   //end test

    res.render('stream',{
      streamName: req.params.name
    });
  });
  //next();
});

app.get('/streams/view', (req,res,next)=>{
  fileSys.readdir(path.join(__dirname +'/streams'), (err,files)=>{
    if(err){
      console.log(err);
    }

    res.render('streamList',{
      streams: files
    });
  });
 });


app.get('/streams/download/:name', (req,res,next)=>{

   if(req.query.format == 'csv'){
     //res.write('Downloading CSV format!');
     res.download(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
       if(err){
         console.log(err);
       }
     });
   }
    else if(req.query.format == 'json'){
      //turn the csv into json
      //download the json
      var csvFile =
      {
        filename: path.join(__dirname + '/streams/' + req.params.name + '/log.csv')
      }
      //parse the csv to temporary json file
      csv2json.parse(csvFile, (err,json)=>{
        var tempFile =
          {
            filename: path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'),
            json: json
          }
        //write file to json
        csv2json.writeJsonToFile(tempFile, (err)=>{
          if(err){
            console.log(err);
          }
          //download json file
          res.download(path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'), (err)=>{
            //delete temp json file when download is complete
            fileSys.unlink(path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'),(err)=>{
              if(err){
                console.log(err);
              }
            });
          });
        });
      });
    }

    else{
      res.send('Format Currently not supported, Downloading CSV!');
      res.download(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
        if(err){
          console.log(err);
        }
    });
   }
   //next();
});

app.get('/streams/delete/:name/:delete_key', (req,res,next)=>{
  fileSys.readdir(path.join(__dirname+'/streams/'+req.params.name), (err,files)=>{
    if(err){
      res.end('Stream Not Found!');
      console.log(err);
    }
    jsonfile.readFile(path.join(__dirname+'/streams/'+req.params.name+'/meta.json'), (err,data)=>{
        //console.log('stream deleted!');

         if(!data.del_key === req.params.delete_key){
           res.end('incorrect delete key');
         }

        rmdir(path.join(__dirname+'/streams/'+req.params.name), (err)=>{
          if(err){
            console.log(err);
          }
           res.render('deleted',{
             stream: req.params.name
           });
       });
     });
   });
   //next();
});

app.get('/streams/create/:name', (req,res,next)=>{

streamMeta = {
  "name": req.params.name,
  "key": keygen._(),
  "del_key": keygen._(),
  "fields": Object.keys(req.query),
  "fieldString": "timeStamp"+","+Object.keys(req.query).toString()
}
//create stream directory
fileSys.mkdir(path.join(__dirname+'/streams/'+streamMeta.name), (err)=>{
  if(err){
    console.log(err);
  }

  jsonfile.writeFile(path.join(__dirname+'/streams/'+streamMeta.name+'/meta.json'),streamMeta, (err)=>{
    if(err){
      console.log(err);
    }
    fileSys.appendFile(path.join(__dirname+'/streams/'+streamMeta.name+'/log.csv'),streamMeta.fieldString+'\n',(err)=>{
      //write log.csv
      //respond with private keys
         //example get request
         res.write("Stream Created!" + '\n');
         res.write("Private Key: " + streamMeta.key+ ' \n');
         res.end("Delete Key: " + streamMeta.del_key);
    });
  });
});
//next();
});

app.post('/streams/create', (req,res)=>{
  //var incoming = req.body;
  console.log(req.body);

  streamMeta = {
    "name": req.body.streamName,
    "key": keygen._(),
    "del_key": keygen._(),
    "fields": req.body.fieldCSV,
    "fieldString": "timeStamp"+","+req.body.fieldCSV
  }
  //create stream directory
  fileSys.mkdir(path.join(__dirname+'/streams/'+streamMeta.name), (err)=>{
    if(err){
      console.log(err);
    }

    jsonfile.writeFile(path.join(__dirname+'/streams/'+streamMeta.name+'/meta.json'),streamMeta, (err)=>{
      if(err){
        console.log(err);
      }
      fileSys.appendFile(path.join(__dirname+'/streams/'+streamMeta.name+'/log.csv'),streamMeta.fieldString+'\n',(err)=>{
        //write log.csv
        //respond with private keys
           //example get request

           res.render('keys',{
              streamName: streamMeta.name,
              privateKey: streamMeta.key,
              deleteKey: streamMeta.del_key
         });
      });
    });
  });
});


app.get('/streams/input/:name/:key', (req,res,next)=>{
  //if stream exists
  fileSys.readdir(path.join(__dirname+'/streams/'+req.params.name), (err,files)=>{
    if(err && err.no == -2){
      res.end('Stream Does Not Exist');
      return;
    }

    jsonfile.readFile(path.join(__dirname+'/streams/'+req.params.name+'/meta.json'), (err,data)=>{
        console.log('log made!');

        var fieldLength = data.fields.length;

         if(data.key == undefined || data.key != req.params.key){
           res.end('incorrect secret key');
         }

           json2csv({ data: req.query, hasCSVColumnTitle: false, eol:'\n'}, (err, csv)=> {
             if (err){
               console.log(err);
             }

          if(Object.keys(req.query).length <= fieldLength){
            var ts = new Date();
            var logString = ts.toISOString()+','+csv ;
            fileSys.appendFile(path.join(__dirname+'/streams/'+req.params.name+'/log.csv'), logString, (err)=>{
              if(err){
                console.log(err);
              }
              res.end('1 Success!');
            });
          }
          else{
            res.end('Too many field entries! Double check and try again');
          }
         });
     });
    });
  //  next();
  });

app.get('/streams/clear/:name/:privateKey', (req,res,next)=>{
  fileSys.readdir(path.join(__dirname+'/streams/'+req.params.name), (err,files)=>{
    if(err){
      res.end('Stream Not Found!');
      console.log(err);
    }
    jsonfile.readFile(path.join(__dirname+'/streams/'+req.params.name+'/meta.json'), (err,data)=>{
        //console.log('stream deleted!');

         if(!data.key === req.params.privateKey){
           res.end('incorrect private key');
         }

         if(req.query.backup== 'true' && req.query.format == 'csv'){
           //res.write('Downloading CSV format!');
           res.download(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
             if(err){
               console.log(err);
             }
             fileSys.unlink(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
               if(err){
                 console.log(err);
               }
               fileSys.appendFile(path.join(__dirname+'/streams/'+req.params.name+'/log.csv'), data.fieldString, (err)=>{
                 if(err){
                   console.log(err);
                 }
               });
             });
           });
         }

          else if(req.query.backup == 'true' && req.query.format == 'json'){
            //turn the csv into json
            //download the json
            var csvFile =
            {
              filename: path.join(__dirname + '/streams/' + req.params.name + '/log.csv')
            }
            //parse the csv to temporary json file
            csv2json.parse(csvFile, (err,json)=>{
              var tempFile =
                {
                  filename: path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'),
                  json: json
                }
              //write file to json
              csv2json.writeJsonToFile(tempFile, (err)=>{
                if(err){
                  console.log(err);
                }
                //download json file
                res.download(path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'), (err)=>{
                  //delete temp json file when download is complete
                  fileSys.unlink(path.join(__dirname + '/streams/' + req.params.name + '/' + req.params.name + '.json'),(err)=>{
                    if(err){
                      console.log(err);
                    }
                    fileSys.unlink(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
                      if(err){
                        console.log(err);
                      }
                      fileSys.appendFile(path.join(__dirname+'/streams/'+req.params.name+'/log.csv'), data.fieldString, (err)=>{
                        if(err){
                          console.log(err);
                        }
                      });
                    });
                  });
                });
              });
            });
          }

          else if(req.query.backup == 'false'){

            fileSys.unlink(path.join(__dirname + '/streams/' + req.params.name + '/log.csv'), (err)=>{
              if(err){
                console.log(err);
              }
              fileSys.appendFile(path.join(__dirname+'/streams/'+req.params.name+'/log.csv'), data.fieldString, (err)=>{
                if(err){
                  console.log(err);
                }
                res.send('WARNING: Backup option is false, clearning data log without downloading!');
              });
            });
           }
          });
     });
   });


app.use((err, req, res, next)=> {
  res.status(500);
  res.render('error', { error: err });
  });

app.listen(process.env.PORT || 5000, ()=>{
  console.log('listening on 5000');
});
