mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 15 })
            .setHTML(
                `<h3>${camp.title}</h3>
        <p>${camp.location}</p>`
            )
    )
    .addTo(map);

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');