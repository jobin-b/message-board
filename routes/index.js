var express = require('express');
var router = express.Router();
require('dotenv').config();
const { MongoClient, ServerApiVersion  } = require("mongodb");
const uri = "mongodb+srv://jobinbabuhpj:" + process.env.SECRET_KEY + "@cluster0.aohqf3c.mongodb.net/?retryWrites=true&w=majority"; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("message-board").collection("messages");
let messages = [];

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("message-board").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    messages = await db.find().toArray();
  } catch(e) {
    console.log(e);
  }finally {
    // Ensures that the client will close when you finish/error
  }
}


    
async function addMessage(message) {
  await db.insertOne(message);
}


// const interval = setInterval(function() {
//   messages = toArray(db.find());
// }, 5000);

// clearInterval(interval);

/* GET home page. */
router.get('/', function(req, res, next) {
  run().then(() => {
    res.render('index', { title: 'Messaging', messages: messages })
  }
  );
});

/* GET new page. */
router.get('/new', function(req, res, next) {
  res.render('form');
});

router.post("/new", function(req, res, next) {
  let {messageUser, messageText} = req.body;
  addMessage({text: messageText, user: messageUser, added: new Date()}).catch((err) => console.log(err));
  res.redirect('/');
});

module.exports = router;
