var locations = [{
    name: "Red Bull Arena",
    address: "600 Cape May St, Harrison, NJ 07029",
    lat: 40.737046,
    long: -74.150361
}, {
    name: "MetLife Stadium",
    address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
    lat: 40.813091,
    long: -74.074209
}, {
    name: "World Trade Center",
    address: "285 Fulton St, New York, NY 10007",
    lat: 40.713175,
    long: -74.013104
}, {
    name: "Zeppelin Hall Biergarten",
    address: "88 Liberty View Dr, Jersey City, NJ 07302",
    lat: 40.715120,
    long: -74.046754
}, {
    name: "Prudential Center",
    address: "25 Lafayette St, Newark, NJ 07102",
    lat: 40.733617,
    long: -74.171150
}, {
    name: "Madison Square Garden",
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    lat: 40.750691,
    long: -73.993476
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
    /*self.locationList = ko.observableArray([]);
    locations.forEach(function(locationItem) {
        self.places.push(new Location(locationItem));
    });*/

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

};



function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(40.753011, -74.128069)
    });

    var infowindow = new google.maps.InfoWindow();

    var marker;



    function createMarker(latlng, html) {
        html = '<h3>' + locations[i].name + '</h3>' + locations[i].address;
        latlng = new google.maps.LatLng(locations[i].lat, locations[i].long);
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(html);
            infowindow.open(map, this);
        });
        return marker;
    }


    for (i = 0; i < locations.length; i++) {
        locations[i].marker = createMarker(new google.maps.LatLng(locations[i].lat, locations[i].long));
    }




    ko.applyBindings(new viewModel());
}
