db.getMongo().getDBNames().forEach(function(d) {
if ( !["admin","config","local"].includes(d)) {
 db.getSiblingDB(d).getCollectionNames().forEach(function(coll) {
  var stats = db.getSiblingDB(d).getCollection(coll).stats({indexDetails:true})
  printjson("---------------------------------------------------")
  if ( stats.wiredTiger !== undefined ){ 
  printjson(d+"."+coll+":"+stats.wiredTiger["block-manager"]["file bytes available for reuse"])
  db.getSiblingDB(d).getCollection(coll).getIndexes().forEach( function(idx) {
   printjson("  "+idx.name+" : "+stats.indexDetails[idx.name]["block-manager"]["file bytes available for reuse"])
  })
}
 })
}
})
