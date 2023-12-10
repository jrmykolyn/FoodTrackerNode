// Import the leaflet package
var L = require('leaflet');

// setting icons so they don't break anymore 
var icon1 = L.icon({
    iconUrl: '/assets/icons/marker-icon.png',
    shadowUrl: '/assets/icons/marker-shadow.png',
    iconAnchor: [25, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor    
    iconSize: [25,41]
    
    
    // needs icon size                             
});


var map = L.map('map').setView([43.7440736,-79.4180339], 10);

var mapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
mapLayer.addTo(map);

let rows = [];

setInterval(function() {   map.invalidateSize(); }, 100)
/*$.get('/mapdata/stores-temp.csv', function(csvString) {

    // Use PapaParse to convert string to array of objects
    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
    let storeAmt = data.length;
    let storeAmtDisp = document.querySelector('.storeAmt');
    storeAmtDisp.textContent = `Displaying data from ${storeAmt} stores`;

    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required
    for (var i in data) {
    var row = data[i];
    console.log(data[i].lat)
    let store;
    if (row.companyID==2){
        store="Loblaws";
    } else if(row.companyID==3) {
        store = 'No Frills'
    } else if(row.companyID==5) {
        store = 'Real Canadian Superstore'
    } else {
        store = "";
    }
    try {
        if (data[i].lat == 'nan' || data[i].lat == 'null') {
        console.log('nan')
        } else {
        var marker = L.marker([row.storeLat, row.storeLong], {
            icon: icon1,
            opacity: 1
        }).bindPopup("<h5 class='popup-title'> " + store + " - " + row.storeName + "</h5>" +
                        "<div>Address: " +row.storeAddress + "</div>" + 
                        "<div>Postal Code: " + row.storePostalCode +"</div>"+
                        "<div class='storebtn' onclick='storeCategory(" +row.storeID+ ")'>See Data</div>");
    
        marker.addTo(map);
        }
    } catch {
        console.log(`error with item ${data[i]}`)
    }

    
    }
});*/

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
                            opacity: 1,
                            color: 'black',
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
        //var layerControl = L.control.layers(noDataGrp).addTo(map);

        var overlays = {
            'Scrape Data' : dataGrp,
            'Other stores' : noDataGrp
        }
        var layerControl = L.control.layers().addTo(map)
        layerControl.addOverlay(dataGrp, "Active stores");
        layerControl.addOverlay(noDataGrp, "All other stores");

    
})
.catch(error => console.error('Error fetching markers:', error));


