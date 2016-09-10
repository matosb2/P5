// Set up object array to be used later by map, markers, and list
var locations = [{
    name: "Red Bull Arena",
    address: "600 Cape May St, Harrison, NJ 07029",
    lat: 40.737046,
    long: -74.150361,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/red-bull-arena-harrison"
}, {
    name: "MetLife Stadium",
    address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
    lat: 40.813091,
    long: -74.074209,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/metlife-stadium-east-rutherford"
}, {
    name: "World Trade Center",
    address: "1 World Trade Center, New York, NY 10007",
    lat: 40.713175,
    long: -74.013104,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/one-world-trade-center-new-york-4"
}, {
    name: "Zeppelin Hall Biergarten",
    address: "88 Liberty View Dr, Jersey City, NJ 07302",
    lat: 40.715120,
    long: -74.046754,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/zeppelin-hall-biergarten-and-restaurant-jersey-city-2"
}, {
    name: "Prudential Center",
    address: "25 Lafayette St, Newark, NJ 07102",
    lat: 40.733617,
    long: -74.171150,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/prudential-center-newark"
}, {
    name: "Madison Square Garden",
    address: "7th Ave & 32nd St, New York, NY 10001",
    lat: 40.750691,
    long: -73.993476,
    marker: '',
    yelpWeb: "https://api.yelp.com/v2/business/madison-square-garden-new-york"
}];


//VIEW
var Location = function(data) {
    this.name = ko.observable(data.name);
    /*this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.long = ko.observable(data.long);*/
};

// Considering how 'this' changes in every scope, 'self' will preserve
// 'this' value throughout viewModel.  Since we want our array of objects to be
// able to detect changes as well as respond to changes we use knockout's
// observableArray and pass our array of objects (locations) through it.
// It will now be referred to self.places.
var viewModel = function() {
    var self = this;
    self.places = ko.observableArray(locations);

    // Set currentLocation to first object in object array.
    // When particular object is clicked from list, change currentLocation
    // value to the clicked location.  Also trigger a click on the marker.
    this.currentLocation = ko.observable(self.places()[0]);
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
        google.maps.event.trigger(clickedLocation.marker, 'click');
    };

    // Setting up search so it filters through object array or locations
    // while allowing lowercase typing to bring back relevant results.
    self.query = ko.observable('');
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.places(), function(place) {
            return place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    // Display list of locations in a list view
    self.search = ko.computed(function() {
        for (var i = 0; i < locations.length; i++) {
            locations[i].marker.setVisible(true);
        }
        // If what's typed in input lowercase or not matches a location in object array
        // display the results, however many there are.  If there are objects that don't contain
        // what's typed in the input then hide those objects.
        return ko.utils.arrayFilter(locations, function(place) {
            if (place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                return true;
            }

            place.marker.setVisible(false);
            return false;
        });
    });

};

function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }
    var yelpAPI = function (i) {
    var yelp_url = locations[i].yelpWeb;

    var parameters = {
        oauth_consumer_key: 'AOsWUWqrkWd3Lx9RHt4ihA',
        oauth_token: 'rqRj4BFQ1xVBEut_57pPedSonmLjkyde',
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    	  ll: '40.753011, -74.128069',
    	  radius: 40000,
    	  limit: 5
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, 'bVxTwnXgkOCAg5Kfhrw7eWEthu8', 'cK98_xpt5iXoBJVyeysJzw5Ypxk');
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            console.log(results);
          // Do stuff with results
          locations[i].url = results.url;
          locations[i].rating_img_small_url = results.rating_img_url_small;
          locations[i].snippet_text = results.snippet_text;
        },
        error: function() {
            // Do stuff on fail
        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);
  };
    
  for(var i = 0; i < locations.length; i++) {
    yelpAPI(i);
  }
var map, bounds;
// Main map function that zooms in and centers it at specific location due to the given
// coordinates.  Also displays the map in the respective div.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(40.753011, -74.128069)
    });
    bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();



    // Marker gets created on map with a falling animation and positioned in respective coordinates from locations array up top.
    function createMarker(location) {
        latlng = new google.maps.LatLng(location.lat, location.long);
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latlng
        });
        
        bounds.extend(marker.position);

        // When marker gets clicked on, it toggles bouncing animation and info window pops up
        google.maps.event.addListener(marker, 'click', function() {
            //console.log(location);
            html = '<h3>' + location.name + '</h3>' + location.address;
            html += '<br><img src=' + location.rating_img_small_url + '>';
            html += '<p>' + location.snippet_text + '</p>';
            infowindow.setContent(html);
            infowindow.open(map, this);
            toggleBounce(marker);
        });


        return marker;  
        

    }


    // Set's bounce animation to marker with a timer on it so it doesn't
    // keep bouncing forever
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { marker.setAnimation(null); }, 650);
        }
    }

    // Loop that iterates through each object in the locations array.  Marker property stores coordinates
    // for exact location for each object.  Because createMarker function is called it will display each
    // and every marker in locations on the map.
    for (var i = 0; i < locations.length; i++) {
        locations[i].marker = createMarker(locations[i]);
    }
    map.fitBounds(bounds);
    
    //  Activate knockout bindings
    ko.applyBindings(new viewModel());


    
    
    
}

/*
       * Open the drawer when the menu ison is clicked.
       */
      var menu = document.querySelector('#burgMenu');
      var main = document.querySelector('main');
      var drawer = document.querySelector('#drawer');

      menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();
      });
      main.addEventListener('click', function() {
        drawer.classList.remove('open');
      });
