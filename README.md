# MealSaver 🍽️
Meal planning app made at Warwick Hack 2022
# Pre-requisites
1. MySQL database 🏬

2. NodeJS ⚫

3. A receipt to test it 💯

# Deployment 🚀
To deploy this code, you'll need to clone the repo, then navigate into it using your command line. From there navigate into `api` and run `npm install`. You'll then need to create an environment file in the `api` folder called `.env` with the following data (insert your own database info 🕶️):
```
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=password
```
You can then run `npm run start` from the `api` folder and access the app from `https://localhost:3001`.

*Note*: For first time setup you'll need to add the following stored procedures to your MySQL database after running the script (our MySQL library wouldn't let us 😢):
```
DELIMITER //
                    
                    CREATE PROCEDURE GetPurchasesBetweenDates(IN fromDate VARCHAR(255),IN toDate VARCHAR(255),
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
                        AND items_addition.date > (CONVERT (fromDate, DATETIME))
                        GROUP BY items.item_id;
                    
                    END //
                    
                    DELIMITER ;
                                        
                    DELIMITER //
                    CREATE PROCEDURE GetUsesBetweenDates(
                    	IN fromDate VARCHAR(255),
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
                        AND date < CONVERT(toDate, DATETIME)
                        GROUP BY items.item_id;
                    END //
                    DELIMITER ;
                    ```




[Self destruct button](https://www.youtube.com/watch?v=fabiBsQWDTY&list=PLzJ2D8f51wW-H40q3dMB0evI7iJ0dmRdT)

