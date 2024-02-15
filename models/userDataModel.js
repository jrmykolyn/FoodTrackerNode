const pool = require('./db');


async function addUserSubmit(subDate, userID, subStoreID) {
    const sql = 'insert into user_submit (subDate, userID, subStoreID) values(?,?,?)';
    pool.query(sql, [subDate, userID, subStoreID], (error, results) => {
        if (error) {
            console.error('Error creating new data submission session record:', error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });

}


//second query imports all the values of rows into the user_submit_data section
async function addUserFoodData(subDate, userID, subStoreID, foodData) {
    //need to separate the dictionary values in foodData into separate var and 

    // find the usdID based on the subDate and userID order by desc limit 1
    const usrSubSql = 'insert into user_submit_data () values(?,?,?)'
    await pool.query(usrSubSql,[subDate, userID, subStoreID], (error, res) => {
        if (error) {
            console.error('Error adding new row:', error);
            res.status(500).json({ error: 'Failed to add new user_submit_data row' });
            return;
        }
        res.status(201).json({ message: 'Row added successfully to user_submit_data' });
    });
}

module.exports = {
    addUserSubmit,
    addUserFoodData
}