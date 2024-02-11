async function inputUserData(req, res) {
    /*  subID PK
        subDate
        subUser
        subStoreID


        user_submit_data

        usdID PK
        subID FK
        usdFoodName
        usdFoodBrandName
        usdPriceListing
        usdPriceByWeight
        usdWeight
        usdMetric
        usdAttach
        usdApproved (t/f)
    */
    let data = {
        id: req.params.id,
        foodname: req.params.foodname
    }
    try {
        const food = await foodModel.addUserSubmit(data['id'],data['foodname']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
        const usrData2 = await foodModel.addUserSubmitData(data['id'],data['foodname']);
        res.json(usrData2);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports = {
    inputUserData
}