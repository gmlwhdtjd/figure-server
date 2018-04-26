const fs = require('fs');
const rl = require('readline-sync');
const qr = require('qr-image');
const MongoClient = require('mongodb').MongoClient;

if (process.argv.length != 3)
  console.log("usage: node addAsset.js JsonPath");
else {
  // read Json file
  try {
    var jsonString = fs.readFileSync(process.argv[2]);
  }
  catch (err) {
    console.log("Error reading your Json file" + err);
  }
  
  // Json parsing & Load asset data
  var processedBsons = [];

  var jsonData = JSON.parse(jsonString);
  for (var itemIndex in jsonData) {
    var item = jsonData[itemIndex]

    var itemBson = {};
    itemBson.brandName = item.brandName;
    itemBson.itemId = item.itemId;
    itemBson.itemImage;
    itemBson.assetList = {};
    itemBson.qrList = {};

    var assetLoadFlag = true;

    try {
      // Item Image load
      itemImage = fs.readFileSync(item.itemImagePaht) 
      itemBson.itemImage = itemImage;
    }
    catch (error) {
      console.log("Warning: Item number " + itemIndex + " was excluded during loading of the Image.");
      console.log("         brandName: " + item.brandName);
      console.log("         itemId: " + item.itemId);
      console.log("         File load error: no such file or directory, open '" + item.itemImagePaht + "'");
      console.log();
      assetLoadFlag = false;
    }

    for (var sizeName in item.assetPathList) {
      try {
        // Asset Data load
        assetData = fs.readFileSync(item.assetPathList[sizeName]) 
        itemBson.assetList[sizeName] = assetData;

        // Generate QR Code
        var qrJson = 
        "{" + 
          "\"brandName\":\"" + item.brandName + "\"," +
          "\"itemId\":\"" + item.itemId + "\"," +
          "\"itemSize\":\"" + sizeName + "\"" +
        "}";
        itemBson.qrList[sizeName] = qr.imageSync(qrJson);
      }
      catch (error) {
        console.log("Warning: Item number " + itemIndex + " was excluded during loading of the file.");
        console.log("         brandName: " + item.brandName);
        console.log("         itemId: " + item.itemId);
        console.log("         File load error: no such file or directory, open '" + item.assetPathList[sizeName] + "'");
        console.log();
        assetLoadFlag = false;
        break;
      }
    }

    if (assetLoadFlag) {
      console.log("Item number " + itemIndex + " loaded successfully.");
      processedBsons.push(itemBson);
    }
  }

  // Load Process Check
  console.log("Total number of loaded Item: " + processedBsons.length);
  var upload = rl.question("Do you want to upload these items to server? (y/n) ");

  // Upload
  if (upload == "y" || upload == "Y") {
    MongoClient.connect('mongodb://localhost:27017', function(error, db){
      if(error) {
        console.log(error);
      } else {
        console.log('MongoDB is connected!');

        const FigureDB = db.db('FigureDB');

        FigureDB.collection('Items').insertMany(processedBsons, function(error,res) {
          if(error) {
            console.log(error);
          } else {    
            // save QR code
            for (var index in res.ops) {
              var finishedBson = res.ops[index];
              for (var sizeName in finishedBson.qrList) {
                var filePath = "resource/QR_Code/QR_" + finishedBson.brandName + "_" + finishedBson.itemId + "_" + sizeName + ".png";
                fs.writeFile(filePath, finishedBson.qrList[sizeName], function(err) {
                  if(err)
                    console.log(err);
                  else 
                    console.log("The file was saved!");
                }); 
              }
            }
          }
        });

        db.close();
      }
    });
  }
  else {
    console.log("Upload is cancelled");
  }
}
