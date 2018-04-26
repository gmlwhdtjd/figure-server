const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000;

async function getItemsFromDB(query) {
  let db = await MongoClient.connect('mongodb://localhost:27017');
  let FigureDB = db.db('FigureDB');

  let cursor = await FigureDB.collection("Items").find(query);
  let itemList = await cursor.toArray()
  await db.close();

  return itemList;
}

app.get('/api/itemList', (req, res) => {
  getItemsFromDB()
  .then(items => {
    items.map(item => {
      delete item.assetList;
    });
    res.send({ items });
  });
});

app.get('/api/assetBundles', (req, res) => {
  var dbQuery = {};
  dbQuery.brandName = req.query.brandName
  dbQuery.itemId = req.query.itemId;

  getItemsFromDB(dbQuery)
  .then(items => {
    if(items.length == 1){
      item = items[0];
      assetBinary = item.assetList[req.query.itemSize];
      
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
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
