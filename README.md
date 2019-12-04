# BandcampExt
Bandcamp website extention

Still a lot of things to do, but now you can test it as follow :
 - open someone's Bandcamp collection (e.g. : https://bandcamp.com/ctebcm )
 - open your browser dev tools (F12)
 - copy & paste lib.js content in Javascript console
 - still in JS console, type (or copy & paste) :

<pre><code>BcJs.PreloadPage();

var _startTimer = setInterval(function() {
	if(BcJs.readyToPlay == true) {
		BcJs.playingStatut = BCJS_STATUS_PLAYING;
		BcJs.PlayNextRandomAndWait();
		clearInterval(_startTimer);
		_startTimer = null;
		console.log('....Hell Yeah !');
	} else {
		console.log('Still waitin....');
	}
}, 200);</code></pre>

Enjoy !
