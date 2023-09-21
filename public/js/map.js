
//map stuff for Leaflet
var map = L.map('map').setView([43.7440736,-79.4180339], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let rows = [];

setInterval(function() {   map.invalidateSize(); }, 100)

$.get('/mapdata/stores.csv', function(csvString) {

// Use PapaParse to convert string to array of objects
var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

// For each row in data, create a marker and add it to the map
// For each row, columns `Latitude`, `Longitude`, and `Title` are required
for (var i in data) {
  var row = data[i];
  //console.log(row)
  let store;
  if (row.companyID==2){
    store="Loblaws";
  } else if(row.companyID==3) {
    store = 'No Frills'
  } else {
    store = "";
  }
  if (data[i].lat == 'nan' || data[i].lat == 'null') {
    console.log('nan')
  } else {
    var marker = L.marker([row.storeLat, row.storeLong], {
    opacity: 1
    }).bindPopup("<h5 class='popup-title'> " + store + " - " + row.storeName + "</h5>" +
                    "<div>Address: " +row.storeAddress + "</div>" + 
                    "<div>Postal Code: " + row.storePostalCode +"</div>"+
                    "<div class='storebtn' onclick='storePriceData(" +row.storeID+ ")'>Get Data</div>");
  
  marker.addTo(map);
  }
 
}
});