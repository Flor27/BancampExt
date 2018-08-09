# BandcampExt
Bandcamp website extention

Still a lot of things to do, but now you can test it as follow :
- open someone's Bandcamp collection (e.g. : https://bandcamp.com/ctebcm )
- open your browser dev tools (F12)
- copy & paste lib.js content in Javascript console
- still in JS console, type :
BcJs_PreloadPage();
- wait for the "Ready to play !" message, then type :
BcJs_playingStatut = STATUS_PLAYING;
- then finaly, type the following line to enjoy the sound !
BcJs_PlayNextRandomAndWait();
