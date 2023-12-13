// Import the leaflet package
var L = require('leaflet');

// setting icons so they don't break anymore 
var icon1 = L.icon({
    iconUrl: '/assets/icons/marker-icon.png',
    shadowUrl: '/assets/icons/marker-shadow.png',
    iconAnchor: [25, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor    
    iconSize: [25,41]                         
});
var iconCurr = L.icon({
    iconUrl: '/assets/raccoon.png',
    //shadowUrl: '/assets/icons/marker-shadow.png',
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor    
    iconSize: [25,25]                         
});

var map = L.map('map').setView([43.7440736,-79.4180339], 10);

var mapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
mapLayer.addTo(map);

//SET CURRENT LOCATION AS A MARKER

    const options = {
        enableHighAccuracy: true, 
        // Get high accuracy reading, if available (default false)
        timeout: 5000, 
        // Time to return a position successfully before error (default infinity)
        maximumAge: 2000, 
        // Milliseconds for which it is acceptable to use cached position (default 0)
    };
    //method called immediately, passes in success, error 
    navigator.geolocation.getCurrentPosition(success, error, options);

    function error(err) {
        if (err.code === 1) {
            alert("Please allow geolocation access");
            // Runs if user refuses access
        } else {
            alert("Cannot get current location");
            // Runs if there was a technical problem.
        }
    }
    let marker, circle, zoomed;

    function success(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        // create location marker - needs own group to sit in so we can remove it from the map when searching a new location
        marker = L.marker([lat, lng], {
            icon: iconCurr,
            opacity: 1
        }).addTo(map);
        circle = L.circle([lat, lng], { radius: 20 }).addTo(map);
        map.panTo([lat, lng])
    }
    
    function error(err) {
        if (err.code === 1) {
            alert("Please allow geolocation access");
        } else {
            alert("Cannot get current location");
        }
    }



setInterval(function() {   map.invalidateSize(); }, 100)

fetch('/api/stores')
    .then(response => response.json())
    .then(markers => {
        let storeAmt = markers.length;
        let storeAmtDisp = document.querySelector('.storeAmt');
        storeAmtDisp.textContent = `Displaying data from ${storeAmt} stores`;

        //layer groups 

        let dataGrp = L.layerGroup([])
        let noDataGrp = L.layerGroup([])

        markers.forEach(mk => {
            //console.log(mk.storeID);
            let store;
            if (mk.companyID==2){
                store="Loblaws";
            } else if(mk.companyID==3) {
                store = 'No Frills'
            } else if(mk.companyID==5) {
                store = 'Real Canadian Superstore'
            } else {
                store = "";
            }
        
            try {
                if (mk.storeLat == '' || mk.storeLon == null) {
                console.log('nan')
                } else {
                    if (mk.storeScrapeData == 1) {
                        // if has data, do default, and add it to datagrp, if not, add to other group
                        var marker = L.marker([mk.storeLat, mk.storeLon], {
                            icon: icon1,
                            opacity: 1
                        }).bindPopup("<h5 class='popup-title'> " + store + " - " + mk.storeName + "</h5>" +
                                        "<div>Address: " +mk.storeAddress + "</div>" + 
                                        "<div>Postal Code: " + mk.storePostalCode +"</div>"+
                                        "<div class='storebtn' onclick='storeCategory(" +mk.storeID+ ")'>See Data</div>");
                    
                        marker.addTo(dataGrp);
                    } else {
                        var marker2 = L.circleMarker([mk.storeLat, mk.storeLon], {
                            color: '#665b5b',
                            radius: 7
                        }).bindPopup("<h5 class='popup-title'> " + mk.storeName + "</h5>" +
                                        "<div>Address: " +mk.storeAddress + "</div>" + 
                                        "<div>Postal Code: " + mk.storePostalCode +"</div>"
                                        );
                        marker2.addTo(noDataGrp)
                    }
                }

            } catch (e) {
                console.log(`error with item`)
                console.error(e, e.stack);

            }
        });
        dataGrp.addTo(map)
        noDataGrp.addTo(map)
        //needs layer control but needs layers first

        /* SEARCH FUNCTIONALITY CREATING A NEW MARKER BASED ON THE LOCATION */

        async function geocode(address) {
            const base_url = "https://nominatim.openstreetmap.org/search";
            const params = new URLSearchParams({
                q: address,
                format: "json",
            });
        
            const url = `${base_url}?${params.toString()}`;
        
            try {
                const response = await fetch(url);
                const data = await response.json();
        
                if (data && data.length > 0) {
                    const latitude = parseFloat(data[0].lat);
                    const longitude = parseFloat(data[0].lon);
                    return { latitude, longitude };
                } else {
                    console.log("No results found for the given address.");
                    return null;
                }
            } catch (error) {
                console.error(`Error in geocoding request: ${error}`);
                return null;
            }
        }
        
        document.getElementById("geocodeForm").addEventListener("submit", async function(event) {
            event.preventDefault();
            const addressInput = document.getElementById("addressInput");
            const resultContainer = document.getElementById("resultContainer");
            const address = addressInput.value.trim();
            const coordinates = await geocode(address);
            if (coordinates) {
                resultContainer.innerHTML = `<p>Coordinates for '${address}': ${coordinates.latitude}, ${coordinates.longitude}</p>`;
            
                marker = L.marker([coordinates.latitude, coordinates.longitude], {
                    icon: iconCurr,
                    opacity: 1
                }).addTo(map);
                circle = L.circle([coordinates.latitude, coordinates.longitude], { radius: 20 }).addTo(map);
                map.panTo([coordinates.latitude, coordinates.longitude])
            } else {
                resultContainer.innerHTML = "No results found for the given address.</p>";
            }
        });
        var layerControl = L.control.layers().addTo(map)
        layerControl.addOverlay(dataGrp, "Active stores");
        layerControl.addOverlay(noDataGrp, "All other stores");

    
})
.catch(error => console.error('Error fetching markers:', error));


// SET MAP HEIGHT TO 100%
function changeH() {
    let mapElem = document.querySelector(".map-container")
    let brH = window.innerHeight
    console.log("height: ", brH) 
    mapElem.style.height = `${brH-85}px`;

    //this doesnt go here, it goes in the script.js function that populates the data response div
    let resultH = brh - 150
    let result = document.querySelector(".data_response")       
    result.style.top = `${resultH}px`;
}
changeH();

// Create a div on click to say "use current location"

