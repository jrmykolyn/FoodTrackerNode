//const params = window.location.search
//const id = new URLSearchParams(params).get('id')
"use strict"
let responseDiv = document.querySelector(".data_response")

let storeData = async function(id) {
    console.log('yay' + id);
    const response = await axios.get(`/api/stores/${id}`);
    console.log(response.data);
}

let storePriceData = async function(id) {
    console.log('yay' + id);
    clearDiv()
    const response = await axios.get(`/api/prices/${id}`);
    console.log(response);
    response.data.forEach((row) =>{
        let div = document.createElement('div');
        div.classList.add('foodItem');
        let foodName = document.createTextNode(row.foodName);
        let foodPrice = document.createTextNode("$"+row.priceListing);
        let foodPriceBW = document.createTextNode("$"+row.priceByWeight +" "+row.priceMetric);
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
    //responseDiv.textContent = JSON.stringify(response.data, null, 2);
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


let storeCategory = async function(id) {
    clearDiv()
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
    console.log('yay' + id);
    clearDiv()
    const response = await axios.get(`/api/prices/${id}/${foodname}`);
    console.log(response);
    response.data.forEach((row) =>{
        let div = document.createElement('div');
        div.classList.add('foodItem');
        let foodName = document.createTextNode(row.foodName);
        let foodPrice = document.createTextNode("$"+row.priceListing);
        let foodPriceBW = document.createTextNode(row.priceByWeight +" "+row.priceMetric);
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
    //responseDiv.textContent = JSON.stringify(response.data, null, 2);
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearDiv() {
    let responseDiv = document.querySelector(".data_response")
    responseDiv.innerHTML = '';
}


