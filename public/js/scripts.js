"use strict"
let responseDiv = document.querySelector(".data_response")

let storeData = async function(id) {
    const response = await axios.get(`/api/stores/${id}`);
    console.log(response.data);
}

let storePriceData = async function(id) {
    //This is a duplicate and should be deleted. Review code to ensure it isn't there
    // this is now the get every price associated with this ID query. might take a while to load
    clearDiv()
    const response = await axios.get(`/api/prices/${id}`);
    //console.log(response);
    response.data.forEach((row) =>{
        if(typeof row.foodName === 'undefined'){
            console.log('not working')
        } else {      
            let div = document.createElement('div');
            div.classList.add('foodItem');
            let foodName = document.createTextNode(row.foodName);
            let foodPrice = document.createTextNode("$"+row.priceListing);
            let foodPriceBW = document.createTextNode(`$${row.priceByWeight} ${row.priceMetric}`);
            let foodLink = document.createElement('a');
            let foodLinkTitle = "Read More";
            foodLink.innerHTML = foodLinkTitle;
            foodLink.href = row.priceLink;
            let priceDate = document.createTextNode("data collected: "+row.priceDate)
            let foodItemArray = [foodName, foodPrice, foodPriceBW, foodLink, priceDate]
            let divsubArray = []
            foodItemArray.forEach((item) => {
                let divsub = document.createElement('div');
                divsub.appendChild(item)
                divsubArray.push(divsub)
            });
            divsubArray.forEach((divsub) => {
                div.appendChild(divsub)
                responseDiv.appendChild(div);
            })
        }
    })
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


let storeCategory = async function(id) {
    //clear div so there's no leftover data from previous queries
    clearDiv()
    //create category select buttons
    let catFlex = document.createElement('div');
    catFlex.classList.add('category_flex');
    let closeBtn = document.createElement('div');
    closeBtn.classList.add('close_btn');
    //get food staples set in mapdata/foodstaples.csv
    $.get('/mapdata/staples-temp.csv', function(csvString) {
        //let categories = ['Milk', 'Bananas', 'Eggs', 'Chicken', 'Bread'];
        var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
        let dataRows = data.length
        data.forEach((cat) => {
                if (cat.fcatName != null) {
                    let div = document.createElement('div');
                    div.classList.add('foodItemCat');
                    div.setAttribute("onclick", `categorySel(${id},'${cat.fcatID}')`)
                    let foodName = document.createTextNode(cat.fcatName);
                    let divsub = document.createElement('div');
                    divsub.appendChild(foodName)
                    div.appendChild(divsub)
                    responseDiv.appendChild(div);
                }                
        });
        //move where the data is placed on screen
        let resultH = window.innerHeight - 150
        let result = document.querySelector(".data_response")       
        result.prepend(closeBtn);
        closeBtn.addEventListener('click', function(){ result.innerHTML='';result.style.backgroundColor="rgba(255,255,255,0)"}, false);
        //result.style.top = `${resultH}px`;
        result.style.padding = "1rem"
        result.style.backgroundColor = "rgba(255,255,255,0.9)"
        result.style.border = "1px solid #dadada"
    });
}

let categorySel = async function(storeid,foodStapleID) {
    clearDiv()
    //change query based on getting prices of food items associated with the food staple category
    //const response = await axios.get(`/api/prices/${id}/${foodname}`);
    const response = await axios.get(`/api/latestprice/${storeid}/${foodStapleID}`);
    //console.log(response);
    response.data.forEach((row) => {
        let div = document.createElement('div');
        div.classList.add('foodItem');
        let foodName = document.createTextNode(row.foodName);
        let foodPrice = document.createTextNode("$"+row.priceListing);
        let foodPriceBW = document.createTextNode("$"+row.priceByWeight +" "+row.priceMetric);
        // call function dataConversion pass in price By Weight and priceMetric

        let foodLink = document.createElement('a');
        let foodLinkTitle = "Read More";
        foodLink.innerHTML = foodLinkTitle;
        foodLink.href = row.priceLink;
        let realDate = row.priceDate.slice(0,10)
        let priceDate = document.createTextNode("Data collected on: "+realDate)

        //create an element that links to pricehistory page, adding a string query to it
        let pricehistLink = document.createElement('div');
        pricehistLink.classList.add('priceHistory');
        pricehistLink.innerText ="Store Price History"
        let priceHistAnchor = document.createElement('a')
        priceHistAnchor.appendChild(pricehistLink)
        priceHistAnchor.href = `/pricehist?sid=${row.storeID}&fid=${row.foodID}&wt=${row.priceWeight}`;

        //create an element that links to pricehistory page, adding a string query to it
        let itemCheckLink = document.createElement('div');
        itemCheckLink.classList.add('itemCheck');
        itemCheckLink.innerText ="Item Check"
        itemCheckLink.setAttribute("onclick", `itemCheck(${row.foodID}, ${row.storeID})`)
        
        //add all elems to array to loop through and add to parent div
        let foodItemArray = [foodName, foodPrice, foodPriceBW, foodLink, priceDate, priceHistAnchor, itemCheckLink]
        let divsubArray = []

        foodItemArray.forEach((item) => {
            let divsub = document.createElement('div');
            divsub.appendChild(item)
            divsubArray.push(divsub)
        });
        divsubArray.forEach((divsub) => {
            div.appendChild(divsub)
            responseDiv.appendChild(div);
        })

        
    })
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Similar Item check

let itemCheck = async function(foodID, storeID) {
    clearDiv()
    const response = await axios.get(`/api/similarfood/${foodID}/${storeID}`);
    response.data.forEach((row) => {
        //create div element      
        let div = document.createElement('div');
        div.classList.add('foodItem');
        let storeName = document.createTextNode(row.companyName + " - " + row.storeName)
        let foodName = document.createTextNode(row.foodName);
        let foodPrice = document.createTextNode("$"+row.priceListing);
        let foodPriceBW = document.createTextNode("$"+row.priceByWeight +" "+row.priceMetric);
        // call function dataConversion pass in price By Weight and priceMetric

        let foodLink = document.createElement('a');
        let foodLinkTitle = "Read More";
        foodLink.innerHTML = foodLinkTitle;
        foodLink.href = row.priceLink;
        let realDate = row.priceDate.slice(0,10)
        let priceDate = document.createTextNode("Data collected on: "+realDate)

        //create an element that links to pricehistory page, adding a string query to it
        let pricehistLink = document.createElement('div');
        pricehistLink.classList.add('priceHistory');
        pricehistLink.innerText ="Store Price History"
        let priceHistAnchor = document.createElement('a')
        priceHistAnchor.appendChild(pricehistLink)
        priceHistAnchor.href = `/pricehist?sid=${row.storeID}&fid=${row.foodID}&wt=${row.priceWeight}`;
        
        //add all elems to array to loop through and add to parent div
        let foodItemArray = [storeName, foodName, foodPrice, foodPriceBW, foodLink, priceDate, priceHistAnchor]
        let divsubArray = []

        foodItemArray.forEach((item) => {
            let divsub = document.createElement('div');
            divsub.appendChild(item)
            divsubArray.push(divsub)
        });
        divsubArray.forEach((divsub) => {
            div.appendChild(divsub)
            responseDiv.appendChild(div);
        })

        
    })
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

//clear out the response div beneath the map
function clearDiv() {
    let responseDiv = document.querySelector(".data_response")
    responseDiv.innerHTML = '';
}

let chartPush = async function(storeID,foodID,wt) { 
    const ctx = document.getElementById('myChart');
    const title = document.querySelector('.chartTitle');
    const responseChart = await axios.get(`/api/pricehistory/${storeID}/${foodID}`);
    
    let lineArray = []
    // create set for all unique food Items
    /*responseChart.data.forEach((elem) => {   
        lineArray.push(elem.foodName); 
    }
    );  
    let extraLn = newSet(lineArray);*/
    //with these unique foodNames, create multiple dataset objects 
    /*function newObj(newSeries) {
        let dataset = { 'name': newSeries, data: [], 'price': priceByWeight, 'priceDate':priceDate }
        responseChart.data.forEach((elem) => {
            
        });
    }*/
    /*extraLn.forEach((elem) =>{
        let newLnResp = axios.get(`/api/pricehistory/${foodID}`);
    });*/
    let priceArray = []
    let dateArray = []
    title.innerHTML = `Price History for ${responseChart.data[0].foodName} at ${responseChart.data[0].storeName}`
    responseChart.data.forEach((elem) => 
        {   
            priceArray.push(elem.priceListing); 
            dateArray.push(elem.priceDate.slice(0,10))
        }
    );   
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: dateArray, //This is date
        datasets: [{
            label: `Price History - ${responseChart.data[0].foodName} - ${responseChart.data[0].storeName}`,
            data: priceArray, //This is price
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: false
            }
        }
        }
    });
}

function dataRound(newPBW,newMet) {
    let pbwR = Math.round((newPBW + Number.EPSILON) * 100) / 100
    let returnArray = [pbwR, newMet]
    return returnArray
}

function dataConversion(pbw, pm, newMetric) {
    // use this function in the foreach loop to display
    // find out the metric being used and what its being changed to. default is per kg
    //check to see if pm and newMetric are the same
    if (pm != newMetric) {
        // if values don't match, conversion is necessary
        //run through the set metric 
        //  -> 100g 
        let newPBW;
        let rndVal;
        if (newMetric == '100g'){
            console.log("changing to 100g")
            switch (pm) {
                case 'kg':
                    newPBW = pbw / 10;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
                case 'lb':
                    // 1 lb = 453.959327 g
                    newPBW = pbw * 0.220822840520115583;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
            }
        } else if (newMetric == 'lb') {
            console.log("changing to lb")
            switch (pm) {
                case 'kg':
                    newPBW = pbw * 2.2;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
                case '100g':
                    newPBW = pbw * 4.5359237;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
            }
        } else if (newMetric == 'kg') {
            switch (pm) {
                case 'lb':
                    newPBW = pbw * 0.45359237;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
                case '100g':
                    newPBW = pbw * 10;
                    rndVal = dataRound(newPBW,newMetric)
                    return rndVal
            }
        }
    } 
}

//let data = dataConversion(10,'lb','100g');
//console.log(data)

