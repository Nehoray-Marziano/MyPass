//import { response } from "express";

//console.log(GenerateRandomString())
//console.log(GenerateRandomString())
//console.log(GenerateRandomString())
//console.log(GenerateRandomString())
//console.log(GenerateRandomString())

function save_and_post() {
    console.log("im cat!");
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
    fetch('http://localhost:3000/api/users/register', options).then(response => {

        if (response.status === 200)
            register()

        else {
            //bad username
            alert("this username is already in used, try differnt one");
            again();
        }

    }).catch(function(error) {
        console.log(error);
    });
}


window.addEventListener("click", function() {
    document.getElementById("login").onclick = function() {
        save_and_post();
    }
})

function register() {
    window.location.href = "popup.html";
}

function again() {
    window.location.href = "register.html";
}

function GenerateRandomString() {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";
    let settings = {
        min: 16,
        max: 30
    }
    let length = Math.floor(Math.random() * settings.max) + settings.min

    let str = ""
    for (let i = 0, j = length; i < j; i++) {
        str += chars[Math.floor(Math.random() * (chars.length - 1))]
    }
    return str
}