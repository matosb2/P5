//MODEL
var locations = [
	{
		name: 'Red Bull Arena',
		address: '600 Cape May St, Harrison, NJ 07029'
	},
	{
		name: 'MetLife Stadium',
		address: '1 MetLLife Stadium Dr, East Rutherford, NJ 07073'
	},
	{
		name: 'World Trade Center',
		address: '285 Fulton St, New York, NY 10007'
	},
	{
		name: 'Zeppelin Hall Biergarten',
		address: '88 Liberty View Dr, Jersey City, NJ 07302'
	},
	{
		name: 'Prudential Center',
		address: '25 Lafayette St, Newark, NJ 07102'
	},
	{
		name: 'Madison Square Garden',
		address: '4 Pennsylvania Plaza, New York, NY 10001'
	}
];



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
