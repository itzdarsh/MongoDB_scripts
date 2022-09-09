// script to find the unused Index since last restart
db.getMongo().getDBNames().forEach(function (dbname) {
    if (dbname != [ "admin", "local","config"] ) {
    db.getSiblingDB(dbname).getCollectionNames().forEach(function (cname) {
        output = db.getSiblingDB(dbname)[cname].aggregate({$indexStats:{} });  
        output.forEach(function(findUnused) { 
        if (findUnused.accesses.ops == 0 && findUnused.name != "_id_") {  
            print(dbname + " \t" + cname + " \t" + JSON.stringify(findUnused) );  
        } 
        })
    })
}}) 
