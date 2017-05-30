

    // device APIs are available
    //
	
fSys = null;

function onDeviceReady_fm() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
	fSys = fileSystem;
}

function getFileLocalURL(file, object, target,url){
	if(fSys != null){
		 fSys.root.getFile(cordova.file.dataDirectory + file, {create: true, exclusive: false}, 
		 function(fileEntry){
			 object.attr(target,fileEntry.toURL());
		 }
		 , function(e){object.attr(target,url)});
	}else{
		 object.attr(target,url);
	}
}

function downloadContent(file,url,version){
	
	if(fSys != null){
		fSys.root.getFile(cordova.file.dataDirectory + file, {create: true, exclusive: false}, 
		 function(fileEntry){
			fileEntry.remove(function(){}, function(){});
		 },function(e){});
		var fileTransfer = new FileTransfer();
		var uri = encodeURI(url);

		fileTransfer.download(
			uri,
			cordova.file.dataDirectory + file,
			function(entry) {
			  	$.jStorage.set(file,version);
			},
			function(error) {
				
				fail(error);
			},
			true
		);
	}
}


    
function fail(e) {
	var msg = '';

  switch (e.code) {
   
    case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR Error';
    break;	
    case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR Error';
    break;
    case FileError.ABORT_ERR:
		msg = 'ABORT_ERR Error';
    break;
    case FileError.NOT_READABLE_ERR:
		msg = 'NOT_READABLE_ERR Error';
    break;
    case FileError.ENCODING_ERR:
		msg = 'ENCODING_ERR Error';
    break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
		msg = 'NO_MODIFICATION_ALLOWED_ERR Error';
    break;
    case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR Error';
    break;
    case FileError.SYNTAX_ERR:
		msg = 'SYNTAX_ERR Error';
    break;
    case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR Error';
    break;
    case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR Error';
    break;
    case FileError.TYPE_MISMATCH_ERR:
		msg = 'TYPE_MISMATCH_ERR Error';
    break;
    case FileError.PATH_EXISTS_ERR:
		msg = 'PATH_EXISTS_ERR';
    break;

	  
    default:
      msg = 'Unknown Error';
      break;
  };

 // alert('Error: ' + msg);
}
	


	