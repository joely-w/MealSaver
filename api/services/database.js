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
            port:3306,
            user: Database.user,
            password: Database.password,
            multipleStatements: true
        });

        Database.asyncQuery = util.promisify(Database.conn.query).bind(Database.conn)

        Database.conn.connect(function (err) {
            if (err) throw err;
            console.debug("Connected!");
        });
        this.create_database();
    }

    execute_query(sql) {
        Database.conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
        });
    }


    create_database() {
        let sql =  `CREATE DATABASE IF NOT EXISTS mealsaver;
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
                        name VARCHAR(255) NOT NULL,
                        category INT,
                        FOREIGN KEY (category) REFERENCES categories(cat_id)
                    );
                    
                    CREATE TABLE IF NOT EXISTS items_addition(
                        item_add_id INT PRIMARY KEY,
                        item_id INT,
                        user_id INT,
                        quantity INT,
                        price INT,
                        vendor INT,
                        date DATETIME,
                        FOREIGN KEY (user_id) REFERENCES users(user_id),
                        FOREIGN KEY (item_id) REFERENCES items(item_id)
                    );
                    
                    CREATE TABLE IF NOT EXISTS item_usage(
                        item_use_id INT PRIMARY KEY,
                        item_id INT,
                        user_id INT,
                        quantity INT,
                        date DATETIME,
                        FOREIGN KEY (item_id) REFERENCES items(item_id),
                        FOREIGN KEY (user_id) REFERENCES users(user_id)
                    );`;

        this.execute_query(sql);
    }

}