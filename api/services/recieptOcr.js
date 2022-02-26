require("formidable");
const { ocrSpace } = require('ocr-space-api-wrapper');
const fs = require("fs");
const csv = require("csv-parser");
var stringSimilarity = require("string-similarity");
const Database = require("./database");

module.exports = class OCR{

    itemsArray = [];

    constructor(){
        console.log("here");
        this.put_in_array();
        this.parseReceipt("https://fastly.4sqi.net/img/general/600x600/47596406_O6U_qqwQOjXYqsG8xAMOO0x805hHreZMXf6R1WNma5I.jpg")
            .then(r => console.log(r));
    }

    put_in_array(){
        const csv = require('csv-parser');
        const fs = require('fs');
        fs.createReadStream('Groceries_dataset.csv')
            .pipe(csv())
            .on('data', (row) => {
                if (!(this.itemsArray).includes(row["itemDescription"].toLowerCase())){
                    this.itemsArray.push(row["itemDescription"].toLowerCase());
                }
            })
            .on('end', () => {
                console.log("Items added to array successfully");
            });
    }

    levenshteinDistance (str1 = '', str2 = ''){
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + 1, // insertion
                    track[j - 1][i - 1] + indicator, // substitution
                );
            }
        }
        return track[str2.length][str1.length];
    };

    async parseReceipt (imagePath) {
        try {
            // Using your personal API key + local file
            let receiptItems = [];
            const res = await ocrSpace(imagePath, { apiKey: 'K83288537388957' }); // K82372313488957 K81413160288957 K88956093988957
            //do something with response here.
            const receiptText = (res["ParsedResults"][0]["ParsedText"]).toLowerCase();
            console.log(receiptText);
            const words = receiptText.split("\n");
            let bestMatchString;
            for (let i in words){
                let bestMatch = 0;
                let currentMatch;
                for (let j in this.itemsArray){
                    currentMatch = stringSimilarity.compareTwoStrings(words[i], this.itemsArray[j]);
                    if (currentMatch > bestMatch){
                        bestMatch = currentMatch;
                        bestMatchString = this.itemsArray[j];
                    }
                }
                if (this.levenshteinDistance(bestMatchString, words[i]) < 3){
                    if(receiptItems[bestMatchString]) receiptItems[bestMatchString]++;
                    else receiptItems[bestMatchString] = 1;
                }
            }
            //TODO handle item validation at this point
            for (let x in receiptItems){
                for (let y=0; y<=receiptItems[x]; y++){
                    //TODO update user_id here!
                    //get id of item in DB
                    console.log("X: "+x);
                    Database.conn.query("SELECT item_id FROM items WHERE title LIKE'%"+x+"%'", function (err, result, fields) {
                        if (err) throw err;
                        console.log(result);
                        let id = result[0]["item_id"];
                        Database.conn.query("INSERT INTO items_addition (item_id, user_id, date) VALUES ("+id+", 1,  now())", function (err, result, fields) {
                            if (err) throw err;
                            console.log("inserted into database!");
                        });
                        //console.log(result);
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

}