

    // device APIs are available
    //
	
dirc = null;



onFileSystemSuccess = function(dir){
	dirc = dir;
}


function onDeviceReady_fm() {
	if (device.platform.toLowerCase() == "android") {
		window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,onFileSystemSuccess, failFS);
	}
	else {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemSuccess, failFS);
	}
}


function readBinaryFile(fileEntry,type) {
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            // displayFileData(fileEntry.fullPath + ": " + this.result);

            var blob = new Blob([new Uint8Array(this.result)], { type: type });
            //displayImage(blob);
        };

        reader.readAsArrayBuffer(file);

    }, error);
}

jQuery.fn.extend({
	displayImageByFileURL : function(fileEntry) {
		this.prop("src", fileEntry.toURL());
	}
})




function download(fileEntry, uri,dcb) {

    var fileTransfer = new FileTransfer();
    var fileURL = fileEntry.toURL();

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("Successful download...");
            console.log("download complete: " + entry.toURL());
			console.log("aka001")
			dcb(entry)
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
			window.plugins.toast.showLongCenter("Error downloading file")
        },
        null, // or, pass false
        {
            //headers: {
            //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            //}
        }
    );
}







function saveDoc(url,dcb,fail) {
	var fn = getNameFromUrl(url)
	if(dirc == null){ onDeviceReady_fm()}
    dirc.getDirectory(directory, { create: true }, function (dirEntry) {
        dirEntry.getDirectory(fn.ext, { create: true }, function (subDirEntry) {
           subDirEntry.getFile(fn.fullName, { create: true, exclusive: false }, function (fileEntry) {
			   console.log("here 001")
				download(fileEntry, url,dcb);
			}, fail);
        }, fail);
    }, fail);
}				


    
function failFS(e) {
	console.log(e)
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
	


	