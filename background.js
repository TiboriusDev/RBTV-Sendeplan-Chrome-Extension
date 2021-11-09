var twitch = chrome.extension.twitch.js;
var found, number_of_query = 3;
let rex = [/amazon/, /gog/, /fantasywelt/, /alternate/, /otto/, /razer/, /ebay/, /4netplayers/];

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (change.url) {

        var url = change.url;

        for(var i = 0; i < rex.length; i++){

            found = url.match(rex[i]);
            if(found != null){
                chrome.browserAction.setBadgeBackgroundColor({color: "#f00"});
                chrome.browserAction.setBadgeText({text: "!"});
                return;
            }
        }
        chrome.browserAction.setBadgeText({text: ""});
    }
});

function restore_options() {
    chrome.storage.sync.get(null, function(items){
        if(items.queryNumber != undefined){
            number_of_query = items.queryNumber;
        }else{
            number_of_query = 5
        }
        
    });
}
document.addEventListener('DOMContentLoaded', restore_options);