
const BCJS_STATUS_PLAYING = 1;
const BCJS_STATUS_STOPED = 0;
const BCJS_STATUS_PAUSED = -1;

const BCJS_MODE_NONE = 0;

const BCJS_MODE_RANDOM = 1;
const BCJS_MODE_ORDERED = 2;
const BCJS_MODE_REPEAT_NONE = 4;
const BCJS_MODE_REPEAT_ONE = 8;
const BCJS_MODE_REPEAT_ALL = 16;

var BcJs = {

	timers : {},
	readyToPlay : false,
	currentId : 0,
	playingStatut : BCJS_STATUS_STOPED,
	currentPlaylist : [],
	playedPlaylist : [],
	currentPlayingMode : '',

	StartIntervalTimer : function(fct, delay) {
		if(BcJs.timers[fct.name]) {
			clearInterval(BcJs.timers[fct.name]);
		}
		BcJs.timers[fct.name] = setTimeout(fct, delay);
	},

	ClearIntervalTimer : function(fct) {
		if(BcJs.timers[fct.name]) {
			clearInterval(BcJs.timers[fct.name]);
			delete BcJs.timers[fct.name];
		}
	},

	PreloadPage : function() {
		BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
		BcJs.StartIntervalTimer(BcJs.ScrollAndWait, 300);
	},

	PlayPause : function(){
		var oldStatus = BcJs.playingStatut;
		BcJs.PlayIt(BcJs.currentId);
		BcJs.playingStatut = -oldStatus ;
	},

	Stop : function() {
		BcJs.PlayIt(BcJs.currentId);
		BcJs.playingStatut = BCJS_STATUS_STOPED;
		$('li.collection-item-container[data-itemid='+BcJs.currentId+'] span.item_link_play_bkgd').click();
	},

	PlayNext : function() {
		$('li.collection-item-container.playing').removeClass('playing');
	},

	FocusOnItem : function(itemId) {
		var elemRect = $('li.collection-item-container[data-itemid='+itemId+'] a').get(0).getBoundingClientRect(),
		bodyRect = document.body.getBoundingClientRect(),
		offsetX   = elemRect.left - bodyRect.left;
		offsetY   = elemRect.top - bodyRect.top;
		window.scrollTo(offsetX-10,offsetY-120)
	},

	PlayIt : function(itemId) {
		$('li.collection-item-container[data-itemid='+itemId+'] span.item_link_play_bkgd').click();
		BcJs.FocusOnItem(itemId);
		BcJs.currentId = itemId;
		BcJs.playingStatut = BCJS_STATUS_PLAYING;
		console.log(BcJs.currentPlaylist.length + ' items left in Playlist...');
		BcJs.currentTitle = '"' + $('span[data-bind="text: currentTrack().trackTitle"]').get(0).innerText+ '" from "' +
		$('li.collection-item-container[data-itemid='+itemId+'] div.collection-item-title').get(0).innerText
		+ '" ' +
		$('li.collection-item-container[data-itemid='+itemId+'] div.collection-item-artist').get(0).innerText;
		console.log('BcJs.PlayIt('+itemId+') : ' + BcJs.currentTitle);
	},

	PlayNextRandomAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.PlayNextRandomAndWait);
		if(BcJs.currentPlaylist.length > 0) {
			BcJs.currentPlayingMode = BCJS_MODE_RANDOM;
			if($('li.collection-item-container.playing').length == 0 && BcJs.playingStatut > 0) {
				var nextId = BcJs.currentPlaylist.splice(Math.floor((Math.random() * BcJs.currentPlaylist.length)), 1).shift();
				console.log("nextId = ",nextId);
				nextId = nextId.substr(1, nextId.length -1);
				BcJs.playedPlaylist.push(nextId);
				BcJs.PlayIt(nextId);
			}
			if(BcJs.playingStatut != BCJS_STATUS_STOPED) {
				BcJs.StartIntervalTimer(BcJs.PlayNextRandomAndWait, 500);
			}
		}
		else {
			BcJs.currentPlayingMode = '';
			console.log('Nothing left to play ! :(');
		}
	},

	PlayNextAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.PlayNextAndWait);
		if(BcJs.currentPlaylist.length > 0) {
			BcJs.currentPlayingMode = BCJS_MODE_ORDERED;
			if($('li.collection-item-container.playing').length == 0 && BcJs.playingStatut > 0) {
				var nextId = BcJs.currentPlaylist.shift();
				nextId = nextId.substr(1, nextId.length -1);
				BcJs.PlayIt(nextId);
			}
			if(BcJs.playingStatut != BCJS_STATUS_STOPED) {
				BcJs.StartIntervalTimer(BcJs.PlayNextAndWait, 500);
			}
		}
		else {
			BcJs.currentPlayingMode = '';
			console.log('Nothing left to play ! :(');
		}
	},

	ScrollAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
		console.log('Loading '+ window.collectionTabs.currentTab.grids[0].sequence.length +' of '+ window.collectionTabs.currentTab.grids[0].itemCount +' items...');
		$('button.show-more').click();
		if(window.collectionTabs.currentTab.grids[0].sequence.length < window.collectionTabs.currentTab.grids[0].itemCount) {
			window.scrollTo(10e8,10e8);
			BcJs.StartIntervalTimer(BcJs.ScrollAndWait, 500);
		} else {
			console.log('Ready to play !!!');
			BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
			BcJs.currentPlaylist = collectionTabs.currentTab.grids[0].sequence;
			BcJs.readyToPlay = true;
		}
	},
};

/******************************/
