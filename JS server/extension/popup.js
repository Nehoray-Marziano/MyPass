//import { response } from "express";
continue_session();

function continue_session() {
    console.log("im here!");
    //user_id = localStorage.getItem('user_id');
    chrome.storage.local.get(["user_id"], (res) => {
        if (res.user_id != null) {
            let user_id = res.user_id
            if (user_id === null) {
                console.log('no');
                return;
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
                    console.log(response);
                    return response;
                }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
                    console.log(response.status);
                    if (response.status === 500)
                        return;
                    if (response.status === 200)
                        window.location.href = "user's_creds.html";
                }).catch(function(error) {
                    console.log(error)
                        // bad login
                        //tryagain()
                })
            }
        }
    })

    /*
    if (user_id === null) {
        console.log('no');
        return;
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
            console.log(response);
            return response;
        }).then((response) => { // the unique id nedb gives for each new user in the 'users' db
            console.log(response.status);
            if (response.status === 500)
                return;
            if (response.status === 200)
                window.location.href = "user's_creds.html";
        }).catch(function(error) {
            console.log(error)
                // bad login
                //tryagain()
        })
    }
    */
}


function save_and_post() {
    const username = document.getElementById('username').value;
    const master_password = document.getElementById('master password').value;
    const data = {
        username,
        master_password
    };
    const options = {
        method: 'POST',
        headers: { //we need a header in order to specify the fact that we are going to send something as JSON
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    fetch('http://localhost:3000/api/users/login', options).then((response) => {
        return response.json()
    }).then((user_id) => { // the unique id nedb gives for each new user in the 'users' db
        console.log(user_id);
        //localStorage.setItem('user_id', user_id)
        chrome.storage.local.set({ "user_id": user_id })
        login()
    }).catch(function(error) {
        console.log(error)
            // bad login
        alert("try again")
            //tryagain()
    })
}

window.addEventListener("click", function() {
    document.getElementById("login").onclick = function() {
        save_and_post();
    }
})

function login() {
    window.location.href = "user's_creds.html";
}

function tryagain() {
    window.location.href = "popup.html";
}