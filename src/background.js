var authUser, force;

chrome.storage.sync.get({
    authuser: '',
    force: false,
}, function(result) {
    authUser = result.authuser;
    force = result.force;
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if( details.method === "GET" ) {
        var loweredUrl = details.url.toLowerCase();

        var authUserExists = loweredUrl.indexOf('authuser') >= 0;
        var authUserIsSame = loweredUrl.indexOf('authuser=' + authUser) >= 0;

        var shouldRedirect = ( !authUserExists  || (!authUserIsSame && force ) ) && parseInt(authUser) > 0;
        var isRedirectUriCorrect = ( /meet.google.com\/.*-.*-.*/.test(details.url) || details.url === 'https://meet.google.com/' || 'https://meet.google.com/landing' || 'https://meet.google.com/new' );

        if ( shouldRedirect && isRedirectUriCorrect ) {
            var _redirectUrl = details.url;

            var params = new URLSearchParams(_redirectUrl.split('?')[1]);

            for (var pair of params.entries()) {
                if( pair[0].toLowerCase() === "authuser" ) {
                    params.delete(pair[0]);
                }
            }

            params.set('authuser', authUser);

            _redirectUrl = _redirectUrl.split('?')[0] + "?" + params.toString();

            return {
                redirectUrl: _redirectUrl
            };
        }
    }
}, {
    urls: ["https://meet.google.com/*"] 
}, ["blocking"]); 