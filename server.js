var express = require("express"),
    app = express();
const req = require('request');



///DATABASE FUNCTIONS
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://shrink:shrink@cluster0-r4arw.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collectionText;
client.connect(err => {
  collectionText = client.db("mrshrink").collection("text");
  // perform actions on the collection object
  console.log('Connected')
  //client.close();
});


addDocument=function(doc){
 /* var document={
    content:doc
  }*/
  collectionText.insertOne(doc)
}


var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.get('/analyze',function(request,response){
/*  var text=request.query.text;
  console.log(text)
  addDocument(text)
  response.end('Thank you')*/
  var text= encodeURI(request.query.text);
  console.log(text)
  reqObject="http://localhost:8081/analyze?text="+text;
  req(reqObject,  (err, result, body) => {
    if (err) { return console.log(err); }
    let analyzedDocument={
      originalText:text,
      analysis:result.body
    }
    console.log(result)
    // Add the object to the database
    addDocument(analyzedDocument)    
    // send back to the original caller
    response.json({result:analyzedDocument})

    //response.end(response.json({result:analyzedDocument}))
  });



})

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();
