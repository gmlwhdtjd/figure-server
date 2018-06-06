const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient

const app = express()
const port = process.env.PORT || 5000

app.use(cors())

async function getItemsFromDB(query, field) {
    let db = await MongoClient.connect('mongodb://localhost:27017')
    let FigureDB = db.db('FigureDB')

    let cursor = await FigureDB.collection("Items").find(query).project(field)
    let itemList = await cursor.toArray()
    await db.close()

    return itemList
}

app.get('/api/itemList', (req, res) => {
    var dbQuery = {}
    var dbField = {}
    dbField.brandName = 1
    dbField.itemId = 1
    dbField.itemType = 1
    dbField.itemColor = 1
    dbField.itemImage = 1
    dbField.qrList = 1

    getItemsFromDB(dbQuery, dbField)
    .then(items => {
        res.send({ items })
    })
})

app.get('/api/itemInfo/:itemString', (req, res) => {
    var itemInfo = req.param("itemString").split("-")
    
    var dbQuery = {}
    dbQuery.brandName = itemInfo[0]
    dbQuery.itemId = itemInfo[1]

    var dbField = {}
    dbField.brandName = 1
    dbField.itemId = 1
    dbField.itemType = 1
    dbField.itemColor = 1

    getItemsFromDB(dbQuery, dbField)
    .then(items => {
        if(items.length == 1){
            item = items[0]
            res.send(item)
        }
        else {
            console.log("Find false")
            res.status(500).send('500 File is not exist')
        }
    })
})

app.get('/api/assetBundles/:itemString', (req, res) => {
    var itemInfo = req.param("itemString").split("-")
    
    var dbQuery = {}
    dbQuery.brandName = itemInfo[0]
    dbQuery.itemId = itemInfo[1]

    var dbField = {}
    dbField.assetList = 1

    getItemsFromDB(dbQuery)
    .then(items => {
        if(items.length == 1){
            item = items[0]
            assetBinary = item.assetList[itemInfo[2]]
            
            var filename = itemInfo[0] + '_' + itemInfo[1] + '_' + itemInfo[2]
            console.log("Find Successed : " + filename)
            res.setHeader('Content-Disposition', 'attachment filename=' + filename)
            res.setHeader('Content-Transfer-Encoding', 'binary')
            res.setHeader('Content-Type', 'application/octet-stream')
            res.send(assetBinary.buffer)
        }
        else {
            console.log("Find false")
            res.status(500).send('500 File is not exist')
        }
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
