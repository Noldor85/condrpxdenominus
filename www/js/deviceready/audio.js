(function(n){var a=Math.min,s=Math.max;var e=function(n,a,e){var s=e.length;for(var t=0;t<s;++t)n.setUint8(a+t,e.charCodeAt(t))};var t=function(t,e){this.sampleRate=t;this.numChannels=e;this.numSamples=0;this.dataViews=[]};t.prototype.encode=function(r){var t=r[0].length,u=this.numChannels,h=new DataView(new ArrayBuffer(t*u*2)),o=0;for(var e=0;e<t;++e)for(var n=0;n<u;++n){var i=r[n][e]*32767;h.setInt16(o,i<0?s(i,-32768):a(i,32767),true);o+=2}this.dataViews.push(h);this.numSamples+=t};t.prototype.finish=function(s){var n=this.numChannels*this.numSamples*2,t=new DataView(new ArrayBuffer(44));e(t,0,"RIFF");t.setUint32(4,36+n,true);e(t,8,"WAVE");e(t,12,"fmt ");t.setUint32(16,16,true);t.setUint16(20,1,true);t.setUint16(22,this.numChannels,true);t.setUint32(24,this.sampleRate,true);t.setUint32(28,this.sampleRate*4,true);t.setUint16(32,this.numChannels*2,true);t.setUint16(34,16,true);e(t,36,"data");t.setUint32(40,n,true);this.dataViews.unshift(t);var a=new Blob(this.dataViews,{type:"audio/wav"});this.cleanup();return a};t.prototype.cancel=t.prototype.cleanup=function(){delete this.dataViews};n.WavAudioEncoder=t})(self);
 captureCfg = {

    // The Sample Rate in Hz.
    // For convenience, use the audioinput.SAMPLERATE constants to set this parameter.
    sampleRate: audioinput.SAMPLERATE.CD_AUDIO_44100Hz,
    
    // Maximum size in bytes of the capture buffer.
    bufferSize: 16384,
    
    // The number of channels to use: Mono (1) or Stereo (2).
    // For convenience, use the audioinput.CHANNELS constants to set this parameter.
    channels: audioinput.CHANNELS.MONO,
    
    // The audio format. Currently PCM_16BIT and PCM_8BIT are supported.
    // For convenience, use the audioinput.FORMAT constant to access the possible 
    // formats that the plugin supports.
    format: audioinput.FORMAT.PCM_16BIT,
    
    // Specifies if the audio data should be normalized or not.
    normalize: true,
    
    // Specifies the factor to use if normalization is performed.
    normalizationFactor: 32767.0,
    
    // If set to true, the plugin will handle all conversion of the data to 
    // web audio. The plugin can then act as an AudioNode that can be connected 
    // to your web audio node chain.
    streamToWebAudio: false,
    
    // Used in conjunction with streamToWebAudio. If no audioContext is given, 
    // one (prefixed) will be created by the plugin.
    audioContext: null,
    
    // Defines how many chunks will be merged each time, a low value means lower latency
    // but requires more CPU resources.
    concatenateMaxChunks: 10,
    
    // Specifies the type of the type of source audio your app requires.
    // For convenience, use the audioinput.AUDIOSOURCE_TYPE constants to set this parameter:
    // -DEFAULT
    // -CAMCORDER - Microphone audio source with same orientation as camera if available.
    // -UNPROCESSED - Unprocessed sound if available.
    // -VOICE_COMMUNICATION - Tuned for voice communications such as VoIP.
    // -MIC - Microphone audio source. (Android only)
    // -VOICE_RECOGNITION - Tuned for voice recognition if available (Android only)
    audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT
    
};

totalReceivedData = 0;
audioDataBuffer = [];

function onAudioInputCapture(evt) {
    try {
        if (evt && evt.data) {
            // Increase the debug counter for received data
            totalReceivedData += evt.data.length;

            // Add the chunk to the buffer
            audioDataBuffer = audioDataBuffer.concat(evt.data);
			console.log("totalReceivedData")
        }
    }
    catch (ex) {
        alert("onAudioInputCapture ex: " + ex);
    }
}


function startRecoarding(){
	 try {
		 totalReceivedData = 0;
		audioDataBuffer = [];
		audioinput.start(captureCfg);	
	}catch(e){
		 totalReceivedData = 0;
		audioDataBuffer = [];
		console.log("error",e)
	}
}

function stopRecoarding(audio_control){
	try {
        if (window.audioinput && audioinput.isCapturing()) {
			console.log("stop")
			 audioinput.stop();
			 console.log("Encoding WAV...");
            var encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
            encoder.encode([audioDataBuffer]);

            console.log("Encoding WAV finished");

            var blob = encoder.finish("audio/wav");
            console.log("BLOB created");

			var fileName =  btoa(new Date().toGMTString())+ ".wav";
			 dirc.getDirectory(directory, { create: true }, function (dirEntry) {
				dirEntry.getDirectory("wav", { create: true }, function (subDirEntry) {
				   subDirEntry.getFile(fileName, {create: true}, function (file) {
						file.createWriter(function (fileWriter) {
							fileWriter.write(blob);
							console.log(file.toURL())
							console.log("File created!");
							audio_control.append('<source src="'+file.toURL()+'">')
						}, function () {
							alert("FileWriter error!");
						});
					});
				}, function(e){console.log(e)});
			}, function(e){console.log(e)});
		}
	}catch(e){
		console.log(e)
	}
}

function onDeviceReady_au(){
	window.addEventListener('audioinput', onAudioInputCapture, false);
}

