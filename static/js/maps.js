function initMap() {
    var location = { lat: 52.923165, lng: -1.476831 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: "956c1e32ea6b599"
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: "Code Cuisine Location"
    });
}


window.initMap = initMap;