db.getMongo().getDBNames().forEach(function(dbs) {
	if (!["admin", "config", "local"].includes(dbs)) {
		print("//schema of " + dbs + " database");
		db.getSiblingDB(dbs).getCollectionInfos().forEach(function(info) {
			if ((info.type === "collection" && !(info.name.match(/^system\./))) || (info.type === "timeseries")) {
				//printing create collection statement
				print("db.getSiblingDB('" + dbs + "').createCollection('" + info.name + "', " + JSON.stringify(info.options) + ")");
				idxs = db.getSiblingDB(dbs).getCollection(info.name).getIndexes();
				idxs.forEach(function(idx) {
					if (idx.name !== "_id_") { //to ignore _id index 
						if (typeof(idx.weights) === "undefined") { // normal index
							key = idx.key;
						} else if (typeof(idx.weights) === "object") { // text index
							delete idx.key._fts;
							delete idx.key._ftsx;
							for (k in idx.weights) {
								idx.weights[k] = "text"
							}
							for (k in idx.key) {
								idx.weights[k] = idx.key[k]
							}
							key = idx.weights;
							delete idx.weights;
						}
						delete idx.key;
						delete idx.v;
						// printing createIndex statement based on the index 
						print("db.getSiblingDB('" + dbs + "').getCollection('" + info.name + "').createIndex(" + JSON.stringify(key) + ", " + JSON.stringify(idx) + ")")
					}
				})
			} else if (info.type === "view") {
				// to print createView statement
				print("db.getSiblingDB('" + dbs + "').createView('" + info.name + "','" + info.options.viewOn + "'," + JSON.stringify(info.options.pipeline) + ")")
			}
		})
	}
	try {
		db.getSiblingDB(dbs).getRoles({
			showPrivileges: true
		}).forEach(function(role) {
			print("//dumping roles in " + dbs + " database");
			if (typeof(role["authenticationRestrictions"]) === "undefined") {
				authR = []
			} else {
				authR = role[k]
			};
			role.privileges.forEach(function(privcheck) {
				if (JSON.stringify(privcheck.resource).length === 2) {
					privcheck.resource = {
						"db": "",
						"collection": ""
					}
				}
			})
			print("db.getSiblingDB('" + dbs + "').createRole({role: '" + role.role + "', privileges:" + JSON.stringify(role.privileges) + ", roles: " + JSON.stringify(role.roles) + ",authenticationRestrictions :" + JSON.stringify(authR) + "})")
		})
	} catch (err) {
		print("//cant dump roles as we faced " + err)

	}
	try {
		db.getSiblingDB(dbs).getUsers().forEach(function(user) {
			["_id", "db", "userId"].forEach(function(key) {
				delete user[key]
			});
			print("//dumping users in " + dbs + " database");
			print("print('enter password for `" + user.user + "` in `" + dbs + "` database');\ndb.getSiblingDB('" + dbs + "').createUser({pwd: passwordPrompt()");
			for (k in user) {
				print("," + k + ":" + JSON.stringify(user[k]))
			};
			print("})")
		})
	} catch (err) {
		print("//cant dump users in Atlas cluster as we faced " + err)
	}
})