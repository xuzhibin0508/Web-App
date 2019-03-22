/* eslint-disable no-console, no-process-exit */
require('dotenv').config()
const imdb = require('./src/imdb');
const functions = require("./graphQLFunctions");
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require("body-parser");
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var url = require('url');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var schema = buildSchema(`
    type Query {
      movie: Movie
    }
    type Movie {
      link: String
      metascore: Int
      synopsis: String
      title: String
      year: Int
    }
`);
var root = {
    movie: functions.movie
};

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
const DENZEL_IMDB_ID = 'nm0000243';

const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;


app.get("/movies/populate",  async (req, res) => {
  console.log("Fetching films...")
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  const movies = await imdb(DENZEL_IMDB_ID);
  try{
    var err = await db.collection("movies").drop()
  }catch(e){}
  var err = await db.collection("movies").insertMany(movies)
  console.log("Done !")
  res.send({total: movies.length});
});

app.get("/movies",  async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var goodOne = false
  while (!goodOne){
    var movie = await db.collection("movies").aggregate(
      [ { $sample: { size: 1 } } ]
    ).toArray()
    if(movie[0].metascore >= 70){
      goodOne = true
    }
  }
  res.send(movie[0]);
});

app.get("/movies/search",  async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var url_parts = url.parse(req.url, true);
  var metascore = url_parts.query.metascore
  var limit = url_parts.query.limit
  if (metascore === undefined){
    var movies = await db.collection("movies").find({}).toArray()
  }
  else{
    var movies = await db.collection("movies").find({metascore: {$gte: parseInt(metascore)}}).toArray()
  }
  if(limit === undefined){
    res.send(movies)
  }
  else{
    res.send(movies.slice(0, parseInt(limit)))
  }  
});

app.post("/movies/:id", async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var id = req.params.id
  var movie = await db.collection("movies").findOne({id: req.params.id})
  if(movie === null){
    res.send("no films with this id");
  }
  else{
    await db.collection("movies").update({id: req.params.id}, {$set: {review: req.body}})
    res.send("ok")
  }
})

app.get("/movies/:id",  async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var movie = await db.collection("movies").findOne({id: req.params.id})
  if(movie === null){
    res.send("no results");
  }
  res.send(movie);
});


var listener = app.listen("9292", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

