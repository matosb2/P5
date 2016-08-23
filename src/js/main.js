// Set up object array to be used later by map, markers, and list
var locations = [{
    name: "Red Bull Arena",
    address: "600 Cape May St, Harrison, NJ 07029",
    lat: 40.737046,
    long: -74.150361,
    marker: ''
}, {
    name: "MetLife Stadium",
    address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
    lat: 40.813091,
    long: -74.074209,
    marker: ''
}, {
    name: "World Trade Center",
    address: "285 Fulton St, New York, NY 10007",
    lat: 40.713175,
    long: -74.013104,
    marker: ''
}, {
    name: "Zeppelin Hall Biergarten",
    address: "88 Liberty View Dr, Jersey City, NJ 07302",
    lat: 40.715120,
    long: -74.046754,
    marker: ''
}, {
    name: "Prudential Center",
    address: "25 Lafayette St, Newark, NJ 07102",
    lat: 40.733617,
    long: -74.171150,
    marker: ''
}, {
    name: "Madison Square Garden",
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    lat: 40.750691,
    long: -73.993476,
    marker: ''
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


// Main map function that zooms in and centers it at specific location due to the given
// coordinates.  Also displays the map in the respective div.
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(40.753011, -74.128069)
    });

    var infowindow = new google.maps.InfoWindow();



    // Marker gets created on map with a falling animation and positioned in respective coordinates from locations array up top.
    // Info window information from locations object array above and format stored to html object
    function createMarker(latlng, html) {
        html = '<h3>' + locations[i].name + '</h3>' + locations[i].address;
        latlng = new google.maps.LatLng(locations[i].lat, locations[i].long);
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latlng
        });

        // When marker gets clicked on it toggles bouncing animation and info window pops up 
        // on map with html object information from the createMarker function.
        google.maps.event.addListener(marker, 'click', function() {
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
    for (i = 0; i < locations.length; i++) {
        locations[i].marker = createMarker(new google.maps.LatLng(locations[i].lat, locations[i].long));
    }



    //  Activate knockout bindings
    ko.applyBindings(new viewModel());
}
