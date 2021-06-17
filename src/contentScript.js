if( window.location.href.toLowerCase().indexOf("authuser=") >= 0 ) {
    chrome.storage.sync.get({
        hideAuthUser: false,
    }, function(result) {
        if( result.hideAuthUser ) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
}