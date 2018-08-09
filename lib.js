function BcJs_StartIntervalTimer(fct, delay) {
	if(BcJs_timers[fct.name]) {
		clearInterval(BcJs_timers[fct.name]);
	}
	BcJs_timers[fct.name] = setTimeout(fct, delay);
}

function BcJs_ClearIntervalTimer(fct) {
	if(BcJs_timers[fct.name]) {
		clearInterval(BcJs_timers[fct.name]);
		delete BcJs_timers[fct.name];
	}
}

function BcJs_PreloadPage() {
	BcJs_ClearIntervalTimer(BcJs_ScrollAndWait);
	BcJs_StartIntervalTimer(BcJs_ScrollAndWait, 2000);
}

function BcJs_PlayPause() {
	var oldStatus = BcJs_playingStatut;
	BcJs_PlayIt(BcJs_currentId);
	BcJs_playingStatut = -oldStatus ;
}

function BcJs_Stop() {
	BcJs_PlayIt(BcJs_currentId);
	BcJs_playingStatut = STATUS_STOPED;
	for(var idx=0; idx < BcJs_timers.length; idx++) {
		//BcJs_ClearIntervalTimer(BcJs_timers[idx]);
		console.log(BcJs_timers[idx]);
	}

	$('li.collection-item-container[data-itemid='+BcJs_currentId+'] span.item_link_play_bkgd').click();
}

function BcJs_PlayNext() {
	$('li.collection-item-container.playing').removeClass('playing');
}

function BcJs_FocusOnItem(itemId) {
	var elemRect = $('li.collection-item-container[data-itemid='+itemId+'] a').get(0).getBoundingClientRect(),
	bodyRect = document.body.getBoundingClientRect(),
    offsetX   = elemRect.left - bodyRect.left;
	offsetY   = elemRect.top - bodyRect.top;
	window.scrollTo(offsetX-10,offsetY-10)
}
function BcJs_PlayIt(itemId) {
	console.log('BcJs_PlayIt('+itemId+')');$('li.collection-item-container[data-itemid='+itemId+'] span.item_link_play_bkgd').click();
	BcJs_FocusOnItem(itemId);
	BcJs_currentId = itemId;
	BcJs_playingStatut = STATUS_PLAYING;
}

function BcJs_PlayNextRandomAndWait() {
	BcJs_ClearIntervalTimer(BcJs_PlayNextRandomAndWait);
	if(BcJs_currentPlaylist.length > 0) {
		BcJs_currentPlayingMode = MODE_RANDOM;
		if($('li.collection-item-container.playing').length == 0 && BcJs_playingStatut > 0) {
			var nextId = BcJs_currentPlaylist.splice(Math.floor((Math.random() * BcJs_currentPlaylist.length)), 1).shift();
			nextId = nextId.substr(1, nextId.length -1);
			BcJs_PlayIt(nextId);
		}
		if(BcJs_playingStatut != STATUS_STOPED) {
			BcJs_StartIntervalTimer(BcJs_PlayNextRandomAndWait, 2000);
		}
	}
	else {
		BcJs_currentPlayingMode = '';
	}
}

function BcJs_PlayNextAndWait() {
	BcJs_ClearIntervalTimer(BcJs_PlayNextAndWait);
	if(BcJs_currentPlaylist.length > 0) {
		BcJs_currentPlayingMode = MODE_ORDERED;
		if($('li.collection-item-container.playing').length == 0 && BcJs_playingStatut > 0) {
			var nextId = BcJs_currentPlaylist.shift();
			nextId = nextId.substr(1, nextId.length -1);
			BcJs_PlayIt(nextId);
		}
		if(BcJs_playingStatut != STATUS_STOPED) {
			BcJs_StartIntervalTimer(BcJs_PlayNextAndWait, 2000);
		}
	}
}

function BcJs_ScrollAndWait() {
	BcJs_ClearIntervalTimer(BcJs_ScrollAndWait);
	$('button.show-more').click();
	if(window.collectionTabs.currentTab.grids[0].sequence.length < window.collectionTabs.currentTab.grids[0].itemCount) {
		window.scrollTo(10e8,10e8);
		BcJs_StartIntervalTimer(BcJs_ScrollAndWait, 2000);
	} else {
		console.log('Ready to play !!!');
		BcJs_ClearIntervalTimer(BcJs_ScrollAndWait);
		BcJs_currentPlaylist = collectionTabs.currentTab.grids[0].sequence;
	}
}

const STATUS_PLAYING = 1;
const STATUS_STOPED = 0;
const STATUS_PAUSED = -1;

const MODE_NONE = 0;

const MODE_RANDOM = 1;
const MODE_ORDERED = 2;
const MODE_REPEAT_NONE = 4;
const MODE_REPEAT_ONE = 8;
const MODE_REPEAT_ALL = 16;

var BcJs_timers = {};
var BcJs_currentId;
var BcJs_playingStatut = STATUS_STOPED;
var BcJs_currentPlaylist;
var BcJs_currentPlayingMode;
/******************************/
