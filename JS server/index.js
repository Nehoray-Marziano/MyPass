import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { response } from 'express';
import { SHA512 } from 'crypto-js';

var CryptoJS = require("crypto-js");

var key = "E)H@McQfTjWnZr4u7x!A%D*G-JaNdRgU";
var mackey = "2s5v8y/B?E(H+MbQeThVmYq3t6w9zpC&";



const global_token = "1234";
const express = require('express');
const app = express();
const datastore = require('nedb');

app.listen(3000, () => {
    console.log("listening to port 3000");
});
app.use(express.static('extension')); //being able to get info from static files
app.use(express.json({ limit: '1mb' })) //being able to read data as json

const users = new datastore('users.db');
users.loadDatabase();
const credentials = new datastore('credentials.db');
credentials.loadDatabase();


app.post('/api/users/check_url', (request, response) => {
    credentials.loadDatabase();

    var data = request.body;
    var user_id = data["user_id"];
    var url = data["url"];

    var key3 = mackey.concat(user_id);
    var mykey = key.concat(user_id);


    credentials.find({ "user_id": user_id }, (err, data1) => {
        if (err) {
            console.log("in 'continue session'- failed to find user");
            response.sendStatus(500);
        }
        if (data.length <= 0) {
            response.sendStatus(500);
        } else {

            var i;
            var k = 0;

            for (i = 0; i < data1.length; i++) {

                var check = data1[i].url.substring(0, 64);
                var cifertext = data1[i].url.substring(64);
                var autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

                if (autentication == check) {

                    var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                    if (url == decryptedData) {
                        var k = 1;
                    }
                }

            }
            if (k == 1) {
                response.sendStatus(200);
            } else {
                response.sendStatus(500);

            }

        }
    });

});



app.post('/api/update_password', (request, response) => {
    credentials.loadDatabase();
    console.log("hereee!")
    var data = request.body;
    var user_id = data["user_id"];
    var getUrl = data["url"];


    var rowId = "";

    var key1 = key.concat(user_id);
    var key2 = mackey.concat(user_id);
    //pass to insert
    var password = CryptoJS.AES.encrypt(JSON.stringify(data["password"]), key1).toString();
    var almost = CryptoJS.HmacSHA256(password, key2).toString();
    var newpass = almost.concat(password);


    credentials.find({ "user_id": user_id }, (err, data1) => {
        if (err) {
            console.log("in 'continue session'- failed to find user");
            response.sendStatus(500);
        }
        var i;

        for (i = 0; i < data1.length; i++) {
            var key3 = mackey.concat(user_id);
            var mykey = key.concat(user_id);
            var check = data1[i].url.substring(0, 64);
            var cifertext = data1[i].url.substring(64);
            var autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                // we find the urllllllllllllll
                if (getUrl == decryptedData) {
                    rowId = data1[i]._id;
                    console.log(rowId);
                }
            }
        }
        credentials.update({ "_id": rowId }, {
                $set: { "password": newpass }
            }, { multi: true },
            function() {
                response.sendStatus(200);
            })

    });


});




app.post('/api/credentials/get_by_id', (request, response) => {
    var data = request.body;
    var user_id = data["user_id"];
    credentials.loadDatabase();

    credentials.find({ "user_id": user_id }, (err, data1) => {
        if (err) {
            console.log("in get_passwords: error!");
            response.end();
            return;
        }
        var i;
        for (i = 0; i < data1.length; i++) {

            var mykey = key.concat(user_id);
            var check = data1[i].password.substring(0, 64);
            var cifertext = data1[i].password.substring(64);
            var key3 = mackey.concat(user_id);
            var autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                data1[i].password = decryptedData;

            } else {
                data1[i].password = "attack";
            }

            check = data1[i].username.substring(0, 64);
            cifertext = data1[i].username.substring(64);
            autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                data1[i].username = decryptedData;

            } else {
                data1[i].username = "attack";
            }

            check = data1[i].url.substring(0, 64);
            cifertext = data1[i].url.substring(64);
            autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                data1[i].url = decryptedData;

            } else {
                data1[i].url = "attack";
            }

            check = data1[i].allTogether.substring(0, 64);
            cifertext = data1[i].allTogether.substring(64);
            autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                data1[i].allTogether = "Yes";

            } else {
                data1[i].allTogether = "NO!";
            }
        }
        response.json(data1);
    });
});


app.post('/api/credentials/get_by_url', (request, response) => { // when a user tries to sign in to a website that we have a record of
    credentials.loadDatabase();

    var data = request.body;
    var user_id = data["user_id"];
    var realUrl = data["url"];


    var mykey = key.concat(user_id);
    var key3 = mackey.concat(user_id);

    credentials.find({ "user_id": user_id }, (err, data1) => {
        if (err) {
            console.log("in 'continue session'- failed to find user");
            response.sendStatus(500);
        }
        var i;

        for (i = 0; i < data1.length; i++) {

            var check = data1[i].url.substring(0, 64);
            var cifertext = data1[i].url.substring(64);
            var autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

            if (autentication == check) {

                var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                // we find the urllllllllllllll
                if (realUrl == decryptedData) {


                    var check = data1[i].password.substring(0, 64);
                    var cifertext = data1[i].password.substring(64);
                    var autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

                    if (autentication == check) {

                        var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        data1[i].password = decryptedData;

                    } else {
                        data1[i].password = "attack";
                    }
                    //for the username
                    check = data1[i].username.substring(0, 64);
                    cifertext = data1[i].username.substring(64);
                    autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

                    if (autentication == check) {

                        var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        data1[i].username = decryptedData;

                    } else {
                        data1[i].username = "attack";
                    }
                    //for the url
                    check = data1[i].url.substring(0, 64);
                    cifertext = data1[i].url.substring(64);
                    autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

                    if (autentication == check) {

                        var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        data1[i].url = decryptedData;

                    } else {
                        data1[i].url = "attack";
                    }

                    check = data1[i].allTogether.substring(0, 64);
                    cifertext = data1[i].allTogether.substring(64);
                    autentication = CryptoJS.HmacSHA256(cifertext, key3).toString();

                    if (autentication == check) {

                        var bytes = CryptoJS.AES.decrypt(cifertext, mykey);
                        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        data1[i].allTogether = "Yes";

                    } else {
                        data1[i].allTogether = "NO!";
                    }




                }

            }

        }

        response.json(data1);
    });

});

app.post('/api/users/register', (request, response) => { // getting the username+password from the 'register' page of the extension
    var data = request.body;
    var toInsert = request.body;
    //toInsert.token = global_token.concat(toInsert.username);
    var usernameUniqe = data["username"];

    var saltpassword = JSON.stringify(data["master_password"]).concat(JSON.stringify(data["username"])); //username is uniqe 'thats wht we use it for salt
    toInsert["master_password"] = sha256(saltpassword);

    toInsert["username"] = sha256(usernameUniqe);


    users.find({ "username": sha256(usernameUniqe) }, (err, data) => {
        if (err) {
            console.log("failed");
        }

        if (data.length <= 0) {

            users.insert(toInsert);
            users.loadDatabase();

            response.sendStatus(200);

        } else {

            response.sendStatus(500);

        }

    });

});

app.post('/api/users/login', (request, response) => { // getting the username+password from the 'login' page of the extension
    var data = request.body;
    var x = data["username"];
    var y = data["master_password"];
    users.loadDatabase();



    var salted = JSON.stringify(y).concat(JSON.stringify(x)); //username is uniqe 'thats wht we use it for salt

    users.find({ "username": sha256(x) }, (err, data) => {
        if (err) {
            console.log("failed");
        }

        if (data.length <= 0) {
            response.sendStatus(500);
        } else {

            if (JSON.stringify(data[0].master_password) === JSON.stringify(sha256(salted))) {
                response.json(data[0]._id)
            }
            //gooddd
            else
                response.sendStatus(500);

        }

    });

});

app.post('/api/users/login/check_id', (request, response) => {
    var data = request.body;
    var user_id = data["user_id"];
    users.find({ "_id": user_id }, (err, data) => {
        if (err) {
            console.log("in 'continue session'- failed to find user");
            response.sendStatus(500);
        }
        if (data.length <= 0) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
});

app.post('/api/credentials/add_credentials', (request, response) => {
    console.log(request.body);
    const data = request.body;

    var key1 = key.concat(data["user_id"]);
    var key2 = mackey.concat(data["user_id"]);

    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data["password"]), key1).toString();
    var ciphertextUseName = CryptoJS.AES.encrypt(JSON.stringify(data["username"]), key1).toString();
    var ciphertextURL = CryptoJS.AES.encrypt(JSON.stringify(data["url"]), key1).toString();
    var ciphertextAllTogether = CryptoJS.AES.encrypt(JSON.stringify(data["allTogether"]), key1).toString();



    //mac
    var almost = CryptoJS.HmacSHA256(ciphertext, key2).toString();
    var done = almost.concat(ciphertext);
    data["password"] = done;

    almost = CryptoJS.HmacSHA256(ciphertextUseName, key2).toString();
    done = almost.concat(ciphertextUseName);
    data["username"] = done;

    almost = CryptoJS.HmacSHA256(ciphertextURL, key2).toString();
    done = almost.concat(ciphertextURL);
    data["url"] = done;

    almost = CryptoJS.HmacSHA256(ciphertextAllTogether, key2).toString();
    done = almost.concat(ciphertextAllTogether);
    data["allTogether"] = done;




    credentials.insert(data);
    credentials.loadDatabase();


    response.json({
        status: 'recieved successfully'
    });

});