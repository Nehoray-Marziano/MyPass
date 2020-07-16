//const { response } = require("express");

let urls = { // struct to all of the options we will soppurt- for a more dynamic approach
    facebook: {
        url: "https://www.facebook.com",
        user: "[name='email']",
        pass: "[name='pass']",
        login: {
            1: "#loginbutton input",
            2: "#loginbutton"
        }
    },
    twitter: {
        url: "https://www.twitter.com",
        user: "[name='email']",
        pass: "[name='pass']",
        login: {
            1: "#loginbutton input",
            2: "#loginbutton"
        }
    }
}

/*
for (const key in urls) {
    if (location.href.startsWith(urls[key].url)) {
        let login_button = document.querySelector("#loginbutton input")
        if (login_button == null) login_button = document.querySelector("#loginbutton")

        for (const key2 in urls[key].login) {
            if (document.querySelector(urls[key].login[key2]) != null) {
                window.addEventListener("click", function() {
                    document.querySelector(urls[key].login[key2]).onclick = function() {
                        let email = document.querySelector(urls[key].user).value
                        let pass = document.querySelector(urls[key].pass).value
                    }
                })

                break
            }
        }

        break
    }
}
*/

// Check if the user exists by the local storage 'user_id'
function check_id() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["user_id"], (res) => {
            if (res.user_id != null) {
                let user_id = res.user_id

                if (user_id === null) {
                    console.log('No id was found on the local storage!');
                    reject();
                } else {
                    const data = {
                        user_id
                    };
                    const options = {
                        method: 'POST',
                        headers: { //we need a header in order to specify the fact that we are going to send something as JSON
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                    };
                    fetch('http://localhost:3000/api/users/login/check_id', options).then((response) => {
                        //console.log(response);
                        return response;
                    }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
                        //console.log(response.status);
                        if (response.status === 500)
                            reject();
                        if (response.status === 200) {
                            resolve(user_id);
                        }

                    }).catch(function(error) {
                        console.log(error)
                        reject();
                    })
                }
            }
        })
    })
}

function check_url(user_id, url) {
    return new Promise((resolve, reject) => {
        const data = {
            user_id,
            url
        };
        const options = {
            method: 'POST',
            headers: { //we need a header in order to specify the fact that we are going to send something as JSON
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };

        fetch('http://localhost:3000/api/users/check_url', options).then((response) => { //send to the server to check if there is any record for this url
            //console.log(response);
            return response;
        }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
            //console.log(response.status);
            if (response.status === 500) { // no such record- add it!
                //alert("No such record for username: " + username + " and password: " + password + ". Adding it now!");
                //add_credentials(username, password, url);
                reject()
            }
            if (response.status === 200) { //there is a record for this url
                //update_password(username, password, url);
                console.log("found!")
                resolve()
            }

        }).catch(function(error) {
            console.log(error)
            reject()
                // bad login
                //tryagain()
        })
    })
}

//if there was no record for this url, we awnt to add these credentials
/*
function add_credentials(user_id, username, password, url) {
    allTogether = username.concat(password);

    const data = {
        username,
        password,
        user_id,
        allTogether,
        url
    };
    const options = {
        method: 'POST',
        headers: { //we need a header in order to specify the fact that we are going to send something as JSON
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };

    fetch('http://localhost:3000/api/credentials/add_credentials', options).then((response) => { //send to the server to check if there is any record for this url
        console.log(response);
        return response;
    }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
        console.log(response.status);
        if (response.status === 500)
            return;
        if (response.status === 200) {
            console.log('added successfully!');
            return true
        }

    }).catch(function(error) {
        console.log(error)
        return false
    })
}
*/

function add_credentials(user_id, username, password, url) {
    return new Promise((resolve, reject) => {
        allTogether = username.concat(password);

        const data = {
            username,
            password,
            user_id,
            allTogether,
            url
        };
        const options = {
            method: 'POST',
            headers: { //we need a header in order to specify the fact that we are going to send something as JSON
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };

        fetch('http://localhost:3000/api/credentials/add_credentials', options).then((response) => { //send to the server to check if there is any record for this url
            console.log(response);
            return response;
        }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
            console.log(response.status);
            if (response.status === 500)
                reject()
            if (response.status === 200) {
                console.log('added successfully!');
                resolve()
            }

        }).catch(function(error) {
            console.log(error)
            reject()
        })
    })
}

// there is a record, and we want to update it
/*
function update_password(user_id, username, password, url) {
    //we will first ask the user if he wants to update his password
    allTogether = username.concat(password);
    const data = {
        user_id,
        url,
        new_password
    };
    const options = {
        method: 'POST',
        headers: { //we need a header in order to specify the fact that we are going to send something as JSON
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };

    fetch('http://localhost:3000/api/update_password', options).then((response) => { //send to the server to check if there is any record for this url
        console.log("ssssss")
        console.log(response);
        return response;
    }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
        console.log(response.status);
        if (response.status === 500)
            return;
        if (response.status === 200) {
            console.log('added successfully!');
            return true;
        }

    }).catch(function(error) {
        console.log(error)
            // bad login
            //tryagain()
    })
}
*/

function update_password(user_id, username, password, url) {
    return new Promise((resolve, reject) => {
        //we will first ask the user if he wants to update his password
        allTogether = username.concat(password);
        const data = {
            user_id,
            url,
            password
        };
        const options = {
            method: 'POST',
            headers: { //we need a header in order to specify the fact that we are going to send something as JSON
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };

        fetch('http://localhost:3000/api/update_password', options).then((response) => { //send to the server to check if there is any record for this url
            console.log("ssssss")
            console.log(response);
            return response;
        }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
            console.log(response.status);
            if (response.status === 500)
                reject()
            if (response.status === 200) {
                console.log('added successfully!');
                resolve()
            }

        }).catch(function(error) {
            reject()
            console.log(error)
                // bad login
                //tryagain()
        })
    })
}

// Get the username and password from the db by the url and user id
function get_by_url(user_id, url) {
    return new Promise((resolve, reject) => {
        const data = {
            user_id,
            url
        };

        const options = {
            method: 'POST',
            headers: { //we need a header in order to specify the fact that we are going to send something as JSON
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        };
        fetch('http://localhost:3000/api/credentials/get_by_url', options).then(response => {
            return response.json()
        }).then((creds) => {
            let res = null
            for (item of creds) {
                var username = item.username;
                var password = item.password;

                res = {
                    username: username,
                    password: password
                }
            }
            if (res != null) resolve(res)
            else reject()
        }).catch(function(error) {
            console.log(error);
            reject()
        });
    })
}

// Website is facebook.com
let pattern = /^(https:\/\/www\.[a-z0-9]+\.com)/

url = location.href;
if (location.href.startsWith("https://www.facebook.com")) {
    url = url.match(pattern)[0]

    let login_button = document.querySelector("#loginbutton input")
    if (login_button == null) login_button = document.querySelector("#loginbutton")

    let email_e = document.querySelector("[name='email']")
    let pass_e = document.querySelector("[name='pass']")

    if (login_button != null & email_e != null && pass_e != null) {
        // Check if the user exists
        let user_id = false
        check_id().then((user_id) => {
            let username_g = ""
            let password_g = ""

            get_by_url(user_id, url).then((res) => {
                if (confirm('A record for ' + url + ' was found. Do you wish the extension to autofill your credentials?')) {
                    console.log(res.password)
                    username_g = res.username
                    password_g = res.password

                    email_e.value = res.username
                    pass_e.value = res.password
                }
            }).catch(() => {})

            window.addEventListener("click", function() {
                login_button.onclick = function() {
                    let email = email_e.value
                    let pass = pass_e.value

                    check_id().then((user_id) => {
                        //console.log(check_url(user_id, url))
                        check_url(user_id, url).then(() => {
                            // Update user and pass
                            //if (confirm('A record for ' + url + ' was found. Do you wish to update your password?')) {
                            if ((email != username_g || pass != password_g) && confirm('A record for ' + url + ' was found. Do you wish to update your password?')) {
                                update_password(user_id, email, pass, url).then(() => {
                                    console.log('Password was updated!')
                                })
                            }
                        }).catch(() => {
                            // Create user and pass
                            //if (confirm('No record for ' + url + ' was found. Do you wish to save these credentials?')) {
                            if (confirm('No record for ' + url + ' was found. Do you wish to save these credentials?')) {
                                add_credentials(user_id, email, pass, url).then(() => {
                                    console.log('Credentials uploaded successfully!')
                                })
                            }
                        })
                    }).catch(() => {
                        console.log("didn't catch user id")
                    })
                }
            })
        }).catch(() => {
            console.log("didn't catch user id")
        })
    }
} else {
    console.log("ELSE")
}


//twitter
//facebook
//intsta