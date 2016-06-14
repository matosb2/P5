//MODEL




//MODEL VIEW





//VIEW

var map;
function initMap() {


    var myLatlng = new google.maps.LatLng(40.753, -74.144);
    var mapOptions = {
        zoom: 15,
        center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var contentString = '<h1 id="firstHeading" class="firstHeading">Kearny</h1>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

    var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Adventure Begins"
    });
    marker.addListener('click', function(){
    	infowindow.open(map, marker);
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
}
