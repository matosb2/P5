var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.753, lng: -74.144 },
        zoom: 8
    });
}
