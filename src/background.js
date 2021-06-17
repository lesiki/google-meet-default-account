var authUser, force;

chrome.storage.sync.get({
    authuser: '',
    force: false
}, function(result) {
    authUser = result.authuser;
    force = result.force;
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if( details.method === "GET" && details.type === "main_frame" ) {
        var loweredUrl = details.url.toLowerCase();

        var authUserExists = loweredUrl.indexOf('authuser') >= 0;
        var authUserIsSame = authUserExists && loweredUrl.indexOf('authuser=' + authUser) >= 0;

        var shouldRedirect = ( !authUserExists  || (!authUserIsSame && force ) ) && parseInt(authUser) > 0;
        var isRedirectUriCorrect = ( /meet.google.com\/.*-.*-.*/.test(details.url) || details.url === 'https://meet.google.com/' || 'https://meet.google.com/landing' || 'https://meet.google.com/new' );

        if ( shouldRedirect && isRedirectUriCorrect ) {
            var params = new URLSearchParams(details.url.split('?')[1]);

            for (var pair of params.entries()) {
                if( pair[0].toLowerCase() === "authuser" ) {
                    params.delete(pair[0]);
                }
            }

            params.set('authuser', authUser);

            return {
                redirectUrl: details.url.split('?')[0] + "?" + params.toString()
            };
        }
    }
}, {
    urls: ["https://meet.google.com/*"] 
}, ["blocking"]);