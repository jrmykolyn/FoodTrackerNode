const userDataModel = require('../models/userDataModel')


async function inputUserData(req, res) {
    console.log("req.body : ", req.body);
    const {userID,storeID,foodData} = req.body

    // date
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    
    // format date for mysql ingestion
    let currentDate = `${year}-${month}-${day}`;
    try {
        const usrSubmit1 = await userDataModel.addUserSubmit( currentDate, userID, storeID );
        res.json(usrSubmit1);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log("second function fire here")
    try {
        const foodDataSubmit = foodData
        console.log(foodDataSubmit)
    } catch (error) {
        console.error(error)
        console.log("didn't work")
    }
}

module.exports = {
    inputUserData,
}


    /*  subID PK
        subDate
        subUser                     	
        subStoreID              storeID
    user_submit_data
        usdID PK
        subID FK
        usdFoodName             foodname
        usdFoodBrandName        brandName
        usdPriceListing         priceListing
        usdPriceByWeight        priceByWeight
        usdWeight               priceWeight
        usdMetric               priceMetric
        usdAttach
        usdApproved (t/f)
    
    	
    	
    storeAddress	
    priceSale	
    	
    	
    	
    	
    priceLink	
    priceDate

    
        */