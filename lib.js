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
	BcJs_playingStatut = 0;
	for(var idx=0; idx < BcJs_timers.length; idx++) {
		//BcJs_ClearIntervalTimer(BcJs_timers[idx]);
		console.log(BcJs_timers[idx]);
	}

	$('li.collection-item-container[data-itemid='+BcJs_currentId+'] span.item_link_play_bkgd').click();
}

function BcJs_PlayNext() {
	$('li.collection-item-container.playing').removeClass('playing');
}

function BcJs_PlayIt(itemId) {
	console.log('BcJs_PlayIt('+itemId+')');$('li.collection-item-container[data-itemid='+itemId+'] span.item_link_play_bkgd').click();
	var posEl = $('li.collection-item-container[data-itemid='+itemId+'] a').get(0).getBoundingClientRect();
	console.log(posEl);
	window.scrollTo(posEl.x,posEl.y)
	
	BcJs_currentId = itemId;
	BcJs_playingStatut = 1;
}

function BcJs_PlayNextRandomAndWait() {
	BcJs_ClearIntervalTimer(BcJs_PlayNextRandomAndWait);
	if(BcJs_currentPlaylist.length > 0) {
		if($('li.collection-item-container.playing').length == 0 && BcJs_playingStatut > 0) {
			var nextId = BcJs_currentPlaylist.splice(Math.floor((Math.random() * BcJs_currentPlaylist.length)), 1).shift();
			nextId = nextId.substr(1, nextId.length -1);
			BcJs_PlayIt(nextId);
		}
		if(BcJs_playingStatut != 0) {
			BcJs_StartIntervalTimer(BcJs_PlayNextRandomAndWait, 2000);
		}
	}
}


function BcJs_PlayNextAndWait() {
	BcJs_ClearIntervalTimer(BcJs_PlayNextAndWait);
	if(BcJs_currentPlaylist.length > 0) {
		if($('li.collection-item-container.playing').length == 0 && BcJs_playingStatut > 0) {
			var nextId = BcJs_currentPlaylist.shift();
			nextId = nextId.substr(1, nextId.length -1);
			BcJs_PlayIt(nextId);
		}
		if(BcJs_playingStatut != 0) {
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

var BcJs_timers = {};
var BcJs_currentId;
var BcJs_playingStatut = 0;
// Stop = 0; Pause = -1; Play = 1
var BcJs_currentPlaylist;
/******************************/
