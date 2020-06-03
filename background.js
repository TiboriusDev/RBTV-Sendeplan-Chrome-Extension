var found;
var rex = [/amazon/, /gog/, /fantasywelt/, /alternate/, /otto/, /razer/, /ebay/];

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