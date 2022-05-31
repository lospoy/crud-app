// SIMPLE CRUD APP

const connectionString = require('./config')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient


// REQUESTS HERE
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('CRUD-APP')
    const quotesCollection = db.collection('quotes')

    //USE, GET, POST, LISTEN
    app.use(bodyParser.urlencoded({ extended: true}))

    app.get('/', (req, res) => {
      res.sendFile('/CRUDE' +'/index.html')
      const cursor = db.collection('quotes').find()
      console.log(cursor)
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.listen(3000, function() {
      console.log('listening on 3000')
    })
  })
  
  .catch(error => console.error(error))






