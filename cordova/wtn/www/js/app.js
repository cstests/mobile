/**
 * app.js - js for walking through naboo
**/

(function() {

	//cordova - add listener to DOM & check deviceready event
	document.addEventListener('deviceready', function(event) {
		//prevent any bound defaults
		event.preventDefault();
		console.log("cordova checked...device ready");

		function onsInit(event) {
			//properties - initial page load
			var page = event.target;
			console.log("page-event="+page.id);
			//load main menu and navigation
			onsMenu(page);
			//check home page
			if (page.id === 'home') {
				//do something...
			}
			//check maps page & load map
			if (page.id === 'maps') {
				console.log('map page opened');
				//set initial lat and long for maps page
				var lat = 50.400064198;
				var long = -3.505298016;
				buildMap(lat, long);
			}
		}

/*
* ons menu - splitter and nav
*/

		//onsen - main menu
		function onsMenu(page) {
			//main menu
			var menu = document.getElementById('menu');
			//menu link - querySelectorAll due to more than one per page
			var menuLink = document.querySelectorAll('.menu-link');
			//splitter content
			var content = document.getElementById('content');
			//link pages
			var linkPages = ['home', 'maps', 'join', 'host', 'settings', 'help'];

			Array.from(linkPages).forEach(linkpage => {
				//check initial page has actually loaded - forces script to wait before getting menu-open (otherwise returns null...)
				if (page.id === linkpage) {
					console.log("page id = "+page.id);
					//get menu icon - query selector OK due to one per ons page
					var menuOpen = document.querySelector('.menu-open');
					//check menu open is stored...
					if (menuOpen) {
						console.log("menu open stored...");
					}

					//add event listener for main menu
					menuOpen.addEventListener('click', function(event) {
						event.preventDefault();
						//open main menu for current page
						menu.open();
						console.log("menu opened...");
					}, false);
				}
			});

			//add handler for menu links
			onsMenuLink(page, menuLink, menu);
			//set navigation
			onsNav(page);
		}

		//onsen - menu links
		function onsMenuLink(page, menuLink, menu) {
			if (page.id === 'menu.html') {
				console.log("menu target...");
				//add listener per menu link
				Array.from(menuLink).forEach(link => {
					link.addEventListener('click', function(event) {
					event.preventDefault();
					var url = this.getAttribute('url');
					console.log("menu link = "+ url);
					content.load(url)
    			.then(menu.close.bind(menu));
					}, false);
				});
			}
		}

		//onsen - set stack-based navigation for FABs
		function onsNav(page) {
			console.log('onsNav page.id='+page.id);
			if (page.id === 'home') {
    		page.querySelector('#fab-open').onclick = function() {
      		document.querySelector('#navigator').pushPage('fab.html', {data: {title: 'fab page'}});
					console.log("push page title");
    		};
  		} else if (page.id === 'fab') {
    		page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
				console.log("page title = "+page.data.title);
  		}
		}

/*
 * build map using Google Maps API
 * 	- set initial lat and long
 */

		function buildMap(lat, long) {
				//set combined position for user
				var latlong = new google.maps.LatLng(lat, long);
				//set required options
				var mapOptions = {
					center: latlong,
					zoom: 1,
					scrollwheel: false,
					scaleControl: false,
					streetViewControl: false,
					zoomControlOptions: {
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					backgroundColor: '#ffffff'
				//	disableDefaultUI: true
				};

				//build map in map div...
				var map = new google.maps.Map(document.getElementById("map"), mapOptions);
				//add initial location marker
				//var marker = new google.maps.Marker({position: latlong,map: map});

				/**
 * draft test
 */

var draftImage = new google.maps.ImageMapType({
  getTileUrl: function(ll, z) {
    var X = ll.x % (1 << z);  // wrap
    return "maps/image4/tiles-upload/" + z + "/" + X + "/" + ll.y + ".jpg";
  },
  tileSize: new google.maps.Size(256, 256),
  isPng: false,
  minZoom: 1,
  maxZoom: 5,
  name: "Walking Through Naboo - Map 1",
  alt: "WTN - Map 1"
});

/**
 * set mapTypes to draft custom type
 */
map.mapTypes.set('draft', draftImage);
map.setMapTypeId('draft');

map.setOptions({
  mapTypeControlOptions: {
    mapTypeIds: [
      'draft',
    ],
  }
});

			}

		//onsen - init event is fired after ons-page attached to DOM...
		document.addEventListener('init', onsInit, false);

	}, false);

})();
