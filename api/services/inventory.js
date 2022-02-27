const Database = require("./database");
module.exports = class inventory {

    constructor() {
        let inventoryArr = [];
        //TODO should no longer be hard coded.
        this.user_id = 1;
        //await this.fetch_inventory(1).then(r => null);
        //this.fetch_recipes();
        this.reOrder();
    }

    toSqlDate(myDate) {
        return myDate.toISOString().slice(0, 19).replace('T', ' ');

    }

    subtract_object_arrays(operandA, operandB) {
        for (let i in operandB) {
            for (let j in operandA) {
                if (operandB[i].item_id === operandA[j].item_id) {
                    operandA[j].num = parseInt(operandA[j].num) - parseInt(operandB[i].numSub);
                }
            }
        }
        return operandA;
    }

    //Function to select products a user may wish to order again.
    async reOrder() {
        let currentInventory = this.fetch_inventory(this.user_id);
        //what did the user have this time last week?
        let ourDate = new Date();
        let nowDate = new Date();
        let pastDate = new Date(ourDate.getDate() - 7);
        //ourDate.setDate(pastDate);
        //what did the user have a week ago?
        let resultA = await Database.asyncQuery("CALL GetPurchasesBetweenDates('2000-01-01', '" + this.toSqlDate(nowDate) + "', " + this.user_id + ")");
        let resultB = await Database.asyncQuery("CALL GetUsesBetweenDates('2000-01-01', '" + this.toSqlDate(pastDate) + "', " + this.user_id + ")");
        let diff = this.subtract_object_arrays(resultA[0], resultB[0]);
        let diffdiff = this.subtract_object_arrays(currentInventory, diff);
        return diffdiff;
    }

    async fetch_recipes(userChoicesArr) {
        //get inventory if haven't already;
        //get list of ingredients in search string.
        console.log(userChoicesArr);
        let searchString = "";
        for (let i in userChoicesArr) {
            searchString += userChoicesArr[i].title;
            const {RecipeSearchClient} = require('edamam-api');

            const client = new RecipeSearchClient({
                appId: 'a50899c5',
                appKey: 'f3ae0236aae1a63786322d4458172c20'
            });

            const results = await client.search({query: searchString});
            return results["hits"];
        }
    }

    async fetch_inventory(user_id) {
        //get inventory data about user
        //TODO replace with logged in user
        let a = this;
        const result = await Database.asyncQuery("SELECT COUNT(items.item_id) AS num, items.item_id, items.title FROM items_addition INNER JOIN items ON items.item_id WHERE items_addition.user_id = " + user_id + " AND items.item_id=items_addition.item_id GROUP BY item_id")
        const result2 = await Database.asyncQuery(`SELECT COUNT(items.item_id) AS numSub, items.item_id, items.title
                                                   FROM item_usage
                                                            INNER JOIN items ON items.item_id
                                                   WHERE item_usage.user_id = ${user_id}
                                                     AND items.item_id = item_usage.item_id
                                                   GROUP BY item_id`);
        console.log(result);
        console.log(result2);
        for (let i in result2) {
            for (let j in result) {
                if (result2[i].item_id === result[j].item_id) {
                    result[j].num = parseInt(result[j].num) - parseInt(result2[i].numSub);
                }
            }
        }
        console.log(result);
        //result contains each item with its quantity as num.
        this.inventoryArr = result;
        return result;
    }

}