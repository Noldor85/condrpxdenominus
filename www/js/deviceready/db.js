function onDeviceReady_db(){
	db = new PouchDB('condominus', {adapter : 'websql'});
	
	db.upsert = function(id,data,callback,err){
		db.get(id).then(function(doc) {
			  return db.put(Object.assign({
				_id: id,
				_rev: doc._rev
			  },data));
			}).then(function(response) {
			  console.log(response)
			}).catch(function (err) {
			  if(err.status = 404){
				 return  db.put(Object.assign({
				_id: id,
			  },data));
			  }
			});
		
	}

	db.get4Guest = function(id,guest,callback){
		return db.get(id+guest)
	}

	db.upsert4Guest = function(id,guest,data,callback){ 
		return db.upsert(id+guest,data,callback);
	}
}