"use strict"
let responseDiv = document.querySelector(".data_response")

let storeData = async function(id) {
    const response = await axios.get(`/api/stores/${id}`);
    console.log(response.data);
}

let storePriceData = async function(id) {
    //This is a duplicate and should be deleted. Review code to ensure it isn't there
    clearDiv()
    const response = await axios.get(`/api/prices/${id}`);
    console.log(response);
    response.data.forEach((row) =>{
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
   
    })
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


let storeCategory = async function(id) {
    //clear div so there's no leftover data from previous queries
    clearDiv()
    //create category select buttons
    let catFlex = document.createElement('div');
    catFlex.classList.add('category_flex');
    let categories = ['Milk', 'Bananas', 'Eggs', 'Chicken', 'Bread'];
    categories.forEach((cat) => {
        let div = document.createElement('div');
        div.classList.add('foodItemCat');
        div.setAttribute("onclick", `categorySel(${id},'${cat}')`)
        let foodName = document.createTextNode(cat);
        let divsub = document.createElement('div');
        divsub.appendChild(foodName)
        div.appendChild(divsub)
        responseDiv.appendChild(div);
    });

}


let categorySel = async function(id,foodname) {
    clearDiv()
    const response = await axios.get(`/api/prices/${id}/${foodname}`);
    console.log(response);
    response.data.forEach((row) => {
        let div = document.createElement('div');
        div.classList.add('foodItem');
        let foodName = document.createTextNode(row.foodName);
        let foodPrice = document.createTextNode("$"+row.priceListing);
        let foodPriceBW = document.createTextNode("$"+row.priceByWeight +" "+row.priceMetric);
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
        priceHistAnchor.href = `/pricehist?sid=${row.storeID}&fid=${row.foodID}`;
        
        //add all elems to array to loop through and add to parent div
        let foodItemArray = [foodName, foodPrice, foodPriceBW, foodLink, priceDate, priceHistAnchor]
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

function clearDiv() {
    let responseDiv = document.querySelector(".data_response")
    responseDiv.innerHTML = '';
}


let chartPush = async function(storeID,foodID) { 
    const ctx = document.getElementById('myChart');
    const title = document.querySelector('.chartTitle');
    const responseChart = await axios.get(`/api/pricehistory/${storeID}/${foodID}`);
    let priceArray = []
    let dateArray = []
    title.innerHTML = `Price History for ${responseChart.data[0].foodName} at ${responseChart.data[0].storeName}`
    responseChart.data.forEach((elem) => 
        {   
            priceArray.push(elem.priceListing); 
            dateArray.push(elem.priceDate)
        }
    );   
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: dateArray, //This is date
        datasets: [{
            label: 'Price History',
            data: priceArray, //This is price
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    });
}
/*
let getHoserStory = async function() { 
    const hoserResponse = await axios.get(`https://www.thehoser.ca/posts/rss.xml`);
    return hoserResponse;
}
*/