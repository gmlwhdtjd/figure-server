const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/assetBundles', (req, res) => {
  var Client = require('mongodb').MongoClient;

    Client.connect('mongodb://localhost:27017', function(error, db){
      if(error) {
        console.log(error);
      } else {
        const FigureDB = db.db('FigureDB');

        var dbQuery = {};
        dbQuery.brandName = req.query.brandName
        dbQuery.itemId = req.query.itemId;

        var cursor = FigureDB.collection("Items").find(dbQuery);
        cursor.next(function(err,doc){
          if(err){
            console.log(err);
          } 
          else {
            if(doc != null){
              assetBinary = doc.assetList[req.query.itemSize];
              
              var filename = req.query.brandName + '_' +req.query.itemId + '_' +req.query.itemSize;
              console.log("Find Successed : " + filename);
              res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
              res.setHeader('Content-Transfer-Encoding', 'binary');
	            res.setHeader('Content-Type', 'application/octet-stream');
	            res.send(assetBinary.buffer);
            }
            else {
              console.log("Find false")
              res.status(500).send('500 File is not exist');
            }
          }
        });
        db.close();
      }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
