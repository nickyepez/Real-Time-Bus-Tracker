let map;
var markers = [];
const blueBus = {
    url: "https://img.icons8.com/ultraviolet/2x/bus.png",
    size: new google.maps.Size(100, 100),
    anchor: new google.maps.Point(50, 50)
}
const redBus = {
    url: "https://img.icons8.com/fluency/2x/bus.png",
    size: new google.maps.Size(100, 100),
    anchor: new google.maps.Point(50, 50)
}

// load map
function initMap() {
    var myOptions = {
        zoom: 14,
        center: { lat: 42.353350, lng: -71.091525 },
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    var element = document.getElementById('map');
    map = new google.maps.Map(element, myOptions);
    addMarkers();
}

// Add bus markers to map
async function addMarkers() {
    // get bus data
    var locations = await getBusLocations();
    console.log(locations);

    // loop through data, add bus markers
    locations.forEach(function (bus) {
        var marker = getMarker(bus.id);
        if (marker) {
            moveMarker(marker, bus);
        }
        else {
            addMarker(bus);
        }
    });

    // timer
    console.log(new Date());
    setTimeout(addMarkers, 5000);
}

// Request bus data from MBTA
async function getBusLocations() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

function addMarker(bus) {
    var icon = getIcon(bus);
    var marker = new google.maps.Marker({
        position: {
            lat: bus.attributes.latitude,
            lng: bus.attributes.longitude
        },
        map: map,
        icon: blueBus,
        // icon: {
        //     icon,
        //     path: google.maps.SymbolPath.CIRCLE,
        //     scale: 5,
        // },
        id: bus.id
    });
    markers.push(marker);
}

function getIcon(bus) {
    // select icon based on bus direction
    if (bus.attributes.direction_id === 0) {
        return blueBus;
    }  
    return redBus;
}

function moveMarker(marker, bus) {
    // change icon if bus has changed direction
    var icon = getIcon(bus);
    marker.setIcon(icon);
   

    // move icon to new lat/lon
    marker.setPosition({
        lat: bus.attributes.latitude,
        lng: bus.attributes.longitude
    });
}

function getMarker(id) {
    var marker = markers.find(function (item) {
        return item.id === id;
    });
    return marker;
}

window.onload = initMap;