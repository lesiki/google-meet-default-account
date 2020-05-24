var authUser;
chrome.storage.sync.get({
    authuser: '',
}, function(result) {
    authUser = result.authuser;
});
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.url.toLowerCase().indexOf('authuser') == -1 && 
            /meet.google.com\/.*-.*-.*/.test(details.url) &&
            details.method == "GET") {
        var _redirectUrl = details.url;
        var newArg = 'authuser=' + authUser;
        _redirectUrl = _redirectUrl + (_redirectUrl.indexOf('?') == -1 ? '?' : '&') + newArg;
        return {
            redirectUrl: _redirectUrl
        };
    }
}, {
    urls: ["https://meet.google.com/*"] 
}, ["blocking"]); 