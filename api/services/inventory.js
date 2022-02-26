const Database = require("./database");
module.exports = class inventory{

    constructor(){
        //get inventory data about user
        //TODO replace with logged in user
        let userId = 1;
        Database.conn.query("SELECT COUNT(items.item_id), items.title FROM items_addition INNER JOIN items ON items.item_id WHERE items_addition.user_id = "+userId+" AND items.item_id=items_addition.item_id",  function (err, result, fields) {
            console.log(result);

        });
    }

}