const mysql = require('mysql');
require('dotenv').config();
let sanitizer = require("sanitizer");
let md5 = require("md5");
const util = require('util')

module.exports = class Database {
    //database connection files - local server must be configured with these details
    static conn;
    static host = process.env["DB_HOST"];
    static user = process.env["DB_USERNAME"];
    static password = process.env["DB_PASSWORD"];

    constructor() {
        Database.conn = mysql.createConnection({
            host: Database.host,
            port: 3306,
            user: Database.user,
            password: Database.password,
            multipleStatements: true
        });

        Database.asyncQuery = util.promisify(Database.conn.query).bind(Database.conn)

        Database.conn.connect(function (err) {
            if (err) throw err;
            console.debug("Connected!");
        });
        this.create_database().then(r => {
            //this.insert_items()
        });
        // FIRST TIME SET UP: RUN THE BELOW FUNCTION!
        //this.create_stored_procedures().then();
    }

    static execute_on_db(sql) {
        Database.conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
        });
    }

    execute_query(sql) {
        Database.conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
        });
    }


    async create_database() {
        let sql = `CREATE DATABASE IF NOT EXISTS mealsaver;
                    USE mealsaver;
                    CREATE TABLE IF NOT EXISTS users(
                        user_id INT AUTO_INCREMENT PRIMARY KEY,
                        first_name VARCHAR(255) NOT NULL, 
                        last_name VARCHAR(255),
                        email VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL
                    );
                    
                    CREATE TABLE IF NOT EXISTS categories(
                        cat_id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL
                    );
                    
                    CREATE TABLE IF NOT EXISTS items(
                        item_id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        category INT,
                        FOREIGN KEY (category) REFERENCES categories(cat_id)
                    );
                    
                    CREATE TABLE IF NOT EXISTS items_addition(
                        item_add_id INT PRIMARY KEY AUTO_INCREMENT,
                        item_id INT,
                        user_id INT,
                        price INT,
                        vendor INT,
                        date DATETIME,
                        FOREIGN KEY (user_id) REFERENCES users(user_id),
                        FOREIGN KEY (item_id) REFERENCES items(item_id)
                    );
                    
                    CREATE TABLE IF NOT EXISTS item_usage(
                        item_use_id INT PRIMARY KEY AUTO_INCREMENT,
                        item_id INT,
                        user_id INT,
                        date DATETIME,
                        FOREIGN KEY (item_id) REFERENCES items(item_id),
                        FOREIGN KEY (user_id) REFERENCES users(user_id)
                    );`;

        return await Database.asyncQuery(sql);
    }

    async create_stored_procedures() {
        let sql = `
                    DELIMITER //
                    
                    CREATE PROCEDURE GetPurchasesBetweenDates(
                        IN fromDate VARCHAR(255),
                        IN toDate VARCHAR(255),
                        IN userId INT
                        )
                    BEGIN
                        SELECT COUNT(items.item_id) AS num, 
                        items.item_id, 
                        items.title 
                        FROM items_addition 
                        INNER JOIN items ON items.item_id 
                        WHERE items_addition.user_id = userId 
                        AND items.item_id=items_addition.item_id 
                        AND items_addition.date < (CONVERT (toDate, DATETIME))
                        AND items_addition.date > (CONVERT (fromDate, DATETIME));
                    
                    END //
                    
                    DELIMITER ;
                                        
                    DELIMITER //
                    CREATE PROCEDURE GetUsesBetweenDates(
                    \tIN fromDate VARCHAR(255),
                        IN toDate VARCHAR(255),
                        IN userId INT
                        )
                    BEGIN
                        SELECT COUNT(item_usage.item_id) AS numSub, items.item_id, items.title, item_usage.date
                        FROM item_usage
                        INNER JOIN items ON items.item_id
                        WHERE item_usage.user_id = userId
                        AND items.item_id = item_usage.item_id
                        AND date > CONVERT(fromDate, DATETIME) 
                        AND date < CONVERT(toDate, DATETIME);
                    END //
                    DELIMITER ;                    
                    
                                        `
        return await Database.asyncQuery(sql)
    }

    insert_items() {
        const csv = require('csv-parser');
        const fs = require('fs');
        const itemsArray = [];
        fs.createReadStream('Groceries_dataset.csv')
            .pipe(csv())
            .on('data', (row) => {
                if (!(itemsArray).includes(row["itemDescription"].toLowerCase())) {
                    itemsArray.push(row["itemDescription"].toLowerCase());
                    this.execute_query("INSERT INTO items (title) VALUES ('" + row['itemDescription'].toLowerCase() + "')");
                }
            })
            .on('end', () => {
                console.log("Items added to DB successfully");
            });


    }

}