function onDeviceReady_db(){
	db = new PouchDB('condominus', {adapter : 'websql'});
}