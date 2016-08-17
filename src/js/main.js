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


//VIEW MODEL
var Location = function(data) {
    this.name = ko.observable(data.name);
    /*this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.long = ko.observable(data.long);*/
};

var viewModel = function() {
    var self = this;
    self.places = ko.observableArray(locations);


    this.currentLocation = ko.observable(self.places()[0]);
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
        google.maps.event.trigger(clickedLocation.marker, 'click');
    };


    self.query = ko.observable('');
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.places(), function(place) {
            return place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    self.search = ko.computed(function() {
        for (var i = 0; i < locations.length; i++) {
            locations[i].marker.setVisible(true);
        }
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

    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { marker.setAnimation(null); }, 650);
        }
    }

    // 
    for (i = 0; i < locations.length; i++) {
        locations[i].marker = createMarker(new google.maps.LatLng(locations[i].lat, locations[i].long));
    }



    //  Activate knockout bindings
    ko.applyBindings(new viewModel());
}
