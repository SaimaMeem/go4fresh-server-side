const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fruj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('go4Fresh').collection('items');

        //items api
        //GET
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            console.log(items);
            res.send(items);
        });
        //GET ONE ITEM
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });
        //PUT UPDATE ONE ITEM
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedItem = req.body;
            console.log(updatedItem);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:{
                    quantity: updatedItem.quantity,
                }
            }
            const result = await itemCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir());

app.get('/', async (req, res) => {
    res.send('Running on the go4fresh server!');
});



app.listen(port, () => {
    console.log('running on the port', port);
})

