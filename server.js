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

    // .set() must be placed before .get(), .use() etc.
    // this tells Express we’re using EJS as the template engine.
    app.set('view engine', 'ejs')

    // USE
    // ***************************
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    // GET
    // ***************************
    app.get('/', (req, res) => {
      // res.sendFile('/CRUDE' +'/index.html') <-delete this?
      
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
    })

    // POST
    // ***************************
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    // PUT
    // ***************************
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    // DELETE
    // ***************************
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })

    // LISTEN
    // ***************************
    app.listen(3000, function() {
      console.log('listening on 3000')
    })
  })

  .catch(error => console.error(error))






