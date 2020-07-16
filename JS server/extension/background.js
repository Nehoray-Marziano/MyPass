chrome.runtime.onMessage.addListener(function(request, sender, send_response) {})

let num_tabs = 0

chrome.tabs.query({}, function(tabs) {
    num_tabs = tabs.length
});

chrome.tabs.onCreated.addListener(function(tab) {
    num_tabs++
})

chrome.tabs.onRemoved.addListener(function(tab) {
    num_tabs--

    if (num_tabs == 0) {
        //localStorage.removeItem("user_id")
        chrome.storage.local.remove(["user_id"], function() {})
    }
})