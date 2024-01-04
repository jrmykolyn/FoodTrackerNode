// Import the leaflet package
var L = require('leaflet');

// setting icons so they don't break 
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
        L.DomUtil.addClass(marker._icon, 'currentLoc');
        circle = L.circle([lat, lng], { radius: 1000, className: 'map-circle' }).addTo(map);
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
        /*let storeAmt = markers.length;
        let storeAmtDisp = document.querySelector('.storeAmt');
        storeAmtDisp.textContent = `Displaying data from ${storeAmt} stores`;*/

        //layer groups 

        let dataGrp = L.layerGroup([])
        let noDataGrp = L.layerGroup([])

        markers.forEach(mk => {
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
                            opacity: 1,
                            className : `store${mk.storeID}`
                        }).bindPopup("<h5 class='popup-title'> " + store + " - " + mk.storeName + "</h5>" +
                                        "<div>Address: " +mk.storeAddress + "</div>" + 
                                        "<div>Postal Code: " + mk.storePostalCode +"</div>"+
                                        "<div class='storebtn' onclick='storeCategory(" +mk.storeID+ ")'>See Data</div>");
                    
                        marker.addTo(dataGrp);
                    } else {
                        var marker2 = L.circleMarker([mk.storeLat, mk.storeLon], {
                            color: '#665b5b',
                            radius: 7,
                            className: `store${mk.storeID}`
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
        
        //create current location icon
        document.getElementById("geocodeForm").addEventListener("submit", async function(event) {
            event.preventDefault();
            const addressInput = document.getElementById("addressInput");
            const resultContainer = document.getElementById("resultContainer");
            const address = addressInput.value.trim();
            const coordinates = await geocode(address);
            if (coordinates) {
                //remove old current location 
                let oldMarker = document.querySelectorAll(".currentLoc")
                    oldMarker.forEach((elem) => elem.style.display = "none") 
                //create new marker for current location
                let marker3 = L.marker([coordinates.latitude, coordinates.longitude], {
                    icon: iconCurr,
                    opacity: 1
                }).addTo(map);
                L.DomUtil.addClass(marker3._icon, 'currentLoc');

                //Create 1km circle around current location
                currentLocCirc = L.circle([coordinates.latitude, coordinates.longitude], { radius: 1000, className: 'map-circle' }).addTo(map);

                //remove old circles
                let oldLocCirc = document.querySelectorAll('.map-circle')
                let oldLocCount = 0
                oldLocCirc.forEach((loc => {
                    if (oldLocCount < (oldLocCirc.length-1)) {
                        loc.style.display = "none";
                        oldLocCount++
                    }
                }))
                let allPts = []
                let under1k =[]
                let currentCoords = currentLocCirc.getLatLng()
                markers.forEach(store => { 
                    //let storesInBuf = points_within.pointsWithinPolygon([store.storeLon,store.storeLat],tBuffer)
                    //console.log(storesInBuf)
                    //+allPts.append([store.storeLon,store.storeLat])
                    //let markDist = currentCoords.distanceTo([coordinates.latitude, coordinates.longitude], [store.storeLat,store.storeLon])
                    let storeCoords;
                    let dist
                    try {
                        storeCoords = L.latLng(store.storeLat,store.storeLon);
                        dist = storeCoords.distanceTo(currentCoords)
                    } catch(e) {
                        console.log('storeCoords null')
                    } finally {
                        if(dist) {
                            //console.log(dist)
                            allPts.push({'storeData': store, 'storeDistance':dist})
                            if (dist < 1000) {
                                under1k.push({'storeData': store, 'storeDistance':dist})
                            }
                        }
                    }
                });
                //sort the store distance data
                allPts.sort(function(a, b){
                    var distA=a.storeDistance, distB=b.storeDistance
                    if (distA < distB) //sort string ascending
                        return -1 
                    if (distA > distB)
                        return 1
                    return 0 //default return value (no sorting)
                })
                under1k.sort(function(a, b){
                    var distA=a.storeDistance, distB=b.storeDistance
                    if (distA < distB) //sort string ascending
                        return -1 
                    if (distA > distB)
                        return 1
                    return 0 //default return value (no sorting)
                })
                //console.log(allPts)

                console.log("stores in your area:",under1k)
                //create a div that will list stores near you. grey out the ones with no data. allow you to compare the prices of items within the area 
                let storeDataDiv = document.querySelector(".store_data_response")  
                storeDataDiv.style.display = "block"
                let storeFlex = document.createElement('div');
                storeFlex.classList.add('store_flex');
                let closeBtn = document.createElement('div');
                closeBtn.classList.add('close_btn');
                // function needs to clear style entirely or display:none;
                closeBtn.addEventListener('click', function(){ storeDataDiv.style.display='none'}, false);
                
                storeDataDiv.innerHTML = ""              
                storeDataDiv.appendChild(closeBtn)
                storeDataDiv.appendChild(storeFlex)
                // create divs for every single store in order of closest to farthest
                for (let i=0;i<allPts.length;i++) {
                    let indStoreDiv = document.createElement('div')
                    let indStoreName = document.createTextNode(`${i+1}. ${allPts[i].storeData.storeName}`);
                    let indStoreDivDist = document.createElement('div')
                    let indStoreDist = document.createTextNode(`${Math.round(allPts[i].storeDistance)}m from current location`);
                    indStoreDivDist.style.fontSize = '0.75rem'
                    storeFlex.appendChild(indStoreDiv)
                    storeFlex.appendChild(indStoreDivDist)
                    indStoreDiv.appendChild(indStoreName)
                    indStoreDivDist.appendChild(indStoreDist)
                    // button flex element to scroll to store on click
                    let indStoreActFlex = document.createElement('div')
                    indStoreActFlex.classList.add('act_btn_flex');
                    indStoreDivDist.appendChild(indStoreActFlex)
                    // if has scrape data put a button to allow access for it
                    if(allPts[i].storeData.storeScrapeData) {
                        let testBtn = createNode('more_store_info','More Store Info',`storeCategory(${allPts[i].storeData.storeID})`)
                        indStoreActFlex.appendChild(testBtn)
                    }
                    // if has website / flyer in data then display the link button
                    /*if(allPts[i].storeData.storeScrapeData) {
                        let testBtn = createNode('more_store_info','More Store Info',`storeCategory(${allPts[i].storeData.storeID})`)
                        indStoreActFlex.appendChild(testBtn)
                    }*/
                    // element to start comparing data

                }
                //pan to current location
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
}
changeH();

// Create a div on click to say "use current location"

//function to create div, pass in the name of div
function createNode(className,textNode,onclick){
    newNode = document.createElement('div')
    newNode.classList.add(className);
    let nodeText = document.createTextNode(textNode);
    if(onclick){
        newNode.setAttribute("onclick", onclick)
    }
    newNode.appendChild(nodeText)
    return newNode
}
