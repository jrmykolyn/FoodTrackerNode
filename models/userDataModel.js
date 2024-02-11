const pool = require('./db');

async function addUserSubmit() {
    const usrSubSql = 'insert into user_submit () values(?,?,?)'
    await pool.query(usrSubSql,[subDate, subUserID, subStoreID], (error, res) => {
        if (error) {
            console.error('Error adding new row:', error);
            res.status(500).json({ error: 'Failed to add new user_submit row' });
            return;
        }
        res.status(201).json({ message: 'Row added successfully to user_submit' });
    });
}

//second query imports all the values of rows into the user_submit_data section
async function addUserSubmitData() {
    const usrSubSql = 'insert into user_submit_data () values(?,?,?)'
    await pool.query(usrSubSql,[subDate, subUserID, subStoreID], (error, res) => {
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
    addUserSubmitData
}