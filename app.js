const express = require('express');

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectId;

const router = express.Router();

const app = express();

const url = require('./url.js');
const port= process.env.port || 8080;

app.use(bodyParser.json());

const client = new MongoClient(url, { useNewUrlParser: true,
     useUnifiedTopology: true});

client.connect(async (err) => {
    try{

        const myDB = await client.db('people').collection('friends');
     
        app.get('/user/:name', async (req, res) => {
     
            console.log(req.params);
     
            await myDB.find(req.params).toArray().then(results => {
     
                console.log(results);
     
                res.contentType('application/json');
     
                res.send(JSON.stringify(results))
     
            })
     
        })
     
      
     
      app.route('/users')
     
            .get(async (req, res) => {
     
                await myDB.find().toArray().then(async (results) => {
     
                    console.log(results);
     
                    res.contentType('application/json');
     
                    res.send(JSON.stringify(results))
     
                })
     
            })
     
            .post(async (req, res) => {
     
                console.log(req.body);
     
                await myDB.insertOne(req.body).then(results => {
      
     
                    console.log(req.body);
     
                    res.contentType('application/json');
     
                    res.send(JSON.stringify(req.body))
     
             })
     
         })
     
         .put(async (req, res) => {
     
                console.log(req.body);
     
                await myDB.findOneAndUpdate({
     
                    _id: ObjectId(req.body._id)
     
                }, {
     
                    $set: {
     
                        name: req.body.name
     
                    }
     
                }, {
     
                    upsert: false
     
                }).then(result => {
     
                    res.contentType('application/json');
     
                    res.send({
     
                        "status": true
     
                    })
     
                })
     
            }) 
     
            .delete(async (req, res) => {
     
                console.log(req.body);
     
                await myDB.deleteOne({
     
                        _id: ObjectId(req.body._id)
     
                    }).then(result => {
     
                        let boo = true; 
     
                        if (result.deleteCount === 0) { 
     
                            boo: false 
     
                        } 
     
                        res.send({ 
     
                            "status": boo 
     
                        }) 
     
                    }) 
     
                    .catch(error => console.log(error)) 
     
            })
     
      
        }
        finally{
            
            //    await client.close();
    }

})

 

app.get('/', (req, res) => { 

   res.sendFile(__dirname + '/public/index.html'); 

}) 

app.listen(port, () => { 

   console.log(`server listening at ${port}`); 

})