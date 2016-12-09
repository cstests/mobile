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
				var lat = 0;
				var long = 0;
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

				//define map
				var map;
				//set combined position for user
				var latlong = new google.maps.LatLng(lat, long);


				var startZoom  = 2;
				var dragSet = false;

				//set required options
				var mapOptions = {
					scrollwheel: false,
					draggable: dragSet,
					scaleControl: false,
					streetViewControl: false,
					zoomControlOptions: {
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					backgroundColor: '#ffffff'
				};

				//build map in map div...
				map = new google.maps.Map(document.getElementById("map"), mapOptions);
				map.setCenter(latlong);
				map.setZoom(startZoom);

      /*  map.addListener('zoom_changed', function() {
          coordInfoWindow.setContent(createInfoWindowContent(latlong, map.getZoom()));
          coordInfoWindow.open(map);
        });*/

				/*var iconBase = "img/avatars/";

				//add initial location marker
				var marker = new google.maps.Marker({
					position: latlong,
					map: map,
					icon: iconBase + 'avatar-test1.jpg'
				});*/

				/**
 * map test
 */

var mapImage = new google.maps.ImageMapType({
  getTileUrl: function(ll, z) {
    var X = ll.x % (1 << z);  // wrap
    return "maps/image4/tiles-upload/" + z + "/" + X + "/" + ll.y + ".jpg";
  },
  tileSize: new google.maps.Size(256, 256),
  isPng: false,
  maxZoom: 5,
	minZoom: startZoom,
  name: "Walking Through Naboo - Map 1",
  alt: "WTN - Map 1"
});

/**
 * set mapTypes to draft custom type
 */
map.mapTypes.set('draft', mapImage);
map.setMapTypeId('draft');

map.setOptions({
  mapTypeControlOptions: {
    mapTypeIds: [
      'draft',
    ],
  }
});

/**
* geocoder
*/
var geocoder = new google.maps.Geocoder();

function geocode(opts) {
  function geocodeResult(response, status) {
    if (status == google.maps.GeocoderStatus.OK && response[0]) {
      map.fitBounds(response[0].geometry.viewport);
    }
  } // trim leading and trailing space with trim capable browsers
  if(opts.address && opts.address.trim) opts.address = opts.address.trim();
  if(opts.address || opts.latLng) geocoder.geocode(opts, geocodeResult); // no empty request
}

var strictBounds;

/*check and limit map and viewport area for drag event*/
google.maps.event.addListenerOnce(map, 'tilesloaded', function() {

var allowedBounds = map.getBounds();

console.log("allowed bounds = "+allowedBounds);

var allowed_ne_lng = allowedBounds.getNorthEast().lng();
var allowed_ne_lat = allowedBounds.getNorthEast().lat();
var allowed_sw_lng = allowedBounds.getSouthWest().lng();
var allowed_sw_lat = allowedBounds.getSouthWest().lat();

// SW first, then NE corner
strictBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(allowed_sw_lat, allowed_sw_lng),
  new google.maps.LatLng(allowed_ne_lat, allowed_ne_lng)
);

    zoomLevel = map.getZoom();

    google.maps.event.addListener(map,'center_changed',function() {
    checkBounds(allowedBounds);
		console.log("center_changed fired");
    });

});

google.maps.event.addListener(map, 'drag', checkBounds);

// Limit map area
function checkBounds(allowedBounds) {

var currentBounds = map.getBounds();

var current_ne_lng = currentBounds.getNorthEast().lng();
var current_ne_lat = currentBounds.getNorthEast().lat();
var current_sw_lng = currentBounds.getSouthWest().lng();
var current_sw_lat = currentBounds.getSouthWest().lat();

console.log("drag event fired...");

}
/*end of drag check*/

// Listen for the dragend event
            google.maps.event.addListener(map, 'dragend', function() {

                if (strictBounds.contains(map.getCenter())) return;

                // out of bounds - move map within bounds
                var c = map.getCenter(),
                x = c.lng(),
                y = c.lat(),
                maxX = strictBounds.getNorthEast().lng(),
                maxY = strictBounds.getNorthEast().lat(),
                minX = strictBounds.getSouthWest().lng(),
                minY = strictBounds.getSouthWest().lat();

                if (x < minX) x = minX;
                if (x > maxX) x = maxX;
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;

                map.setCenter(new google.maps.LatLng(0, 0));



            });

/*zoom level check*/
google.maps.event.addListener(map, 'zoom_changed', function() {
    zoomLevel2 = map.getZoom();

    if (zoomLevel2 == startZoom) {
    map.setOptions({draggable:false});
    }
    else if (zoomLevel2 > startZoom) {
   map.setOptions({draggable: true});
    }

});

}

		//onsen - init event is fired after ons-page attached to DOM...
		document.addEventListener('init', onsInit, false);

	}, false);

})();
