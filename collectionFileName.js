//script to find the collection physical file name located in the MongoDB dbpath
db.getMongo().getDBNames().forEach(function (d){
   db.getSiblingDB(d).getCollectionNames().forEach(function(coll) {
    var stat = db.getSiblingDB(d).getCollection(coll).stats();
    if( typeof stat.wiredTiger !== "undefined")
    {
    printjson("namespace: "+stat.ns+", uri: "+stat.wiredTiger.uri.split(":")[2])
    }
   })
 })
