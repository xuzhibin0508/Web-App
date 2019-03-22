var mongodb = require('mongodb');
const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

module.exports = {
  movie: async function (){
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
    return movie[0]
  }  
}