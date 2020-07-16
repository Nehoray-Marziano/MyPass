//const user_id = localStorage.getItem('user_id');
let user_id = null
chrome.storage.local.get(["user_id"], (res) => {
    if (res.user_id != null) {
        user_id = res.user_id
        get_by_id(user_id)
    }
})

async function get_by_id(user_id) {
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
    fetch('http://localhost:3000/api/credentials/get_by_id', options).then(response => {
        return response.json()
    }).then((creds) => {
        console.log("ok")
        console.log(creds)

        for (item of creds) {
            const root = document.createElement('div');
            const userN = document.createElement('div');
            const pass = document.createElement('div');
            const url = document.createElement('div');
            const allTogether = document.createElement('div');

            userN.textContent = `the username is: ${item.username}`;
            pass.textContent = `the password is: ${item.password}`;
            url.textContent = `the url is: ${item.url}`;

            allTogether.textContent = `Safe row ?: ${item.allTogether}`;

            const del_link = document.createElement("a")
            del_link.id = "delete_row"
            del_link.textContent = "DEL"
            del_link.href = `#qasdads`
            del_link.setAttribute("row_id", item._id)
            root.append(userN, pass, url, allTogether, del_link);
            document.body.append(root);
        }
    }).catch(function(error) {
        console.log("err")
        console.log(error);
    });
}

//get_by_id();


function add_credentials() {
    const username = document.getElementById('new_username').value;
    const password = document.getElementById('new_password').value;
    const url = document.getElementById('new_url').value;
    const allTogether = username.concat(password).concat(url);


    const data = {
        username,
        password,
        url,
        user_id,
        allTogether
    };
    const options = {
        method: 'POST',
        headers: { //we need a header in order to specify the fact that we are going to send something as JSON
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    fetch('http://localhost:3000/api/credentials/add_credentials', options).then(response => {
        console.log(response);
    }).catch(function(error) {
        console.log(error);
    });
}

function change_password() {

}

function remove_password(row_id) {

}

function logout() {
    console.log('hii');

    //localStorage.removeItem('user_id');

    chrome.storage.local.remove(["user_id"], function() {})


    window.location.href = "popup.html";
}

window.addEventListener("click", function() {
    document.getElementById("add").onclick = function() {
        add_credentials();
        window.location.href = "user's_creds.html";

    }
})



window.addEventListener("click", function() {
    document.getElementById("logout").onclick = function() {
        logout();
    }
})