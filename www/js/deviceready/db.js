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
}