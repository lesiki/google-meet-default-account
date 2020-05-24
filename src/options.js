saveButton = document.getElementById('save');
authuserInput = document.getElementById('authuser');

function saveConfig() {
    chrome.storage.sync.set({
        authuser: authuserInput.value,
    }, function() {
        saveButton.setAttribute('class', 'button success');
        saveButton.innerHTML = "Saved";
        chrome.extension.getBackgroundPage().authUser = authuserInput.value;
        setTimeout(function() {
            saveButton.removeAttribute('class');
            window.close();
        }, 750)
    });
}

function validateInput() {
    if (/^\+?(0|[1-9]\d*)$/.test(authuserInput.value)) {
        saveButton.removeAttribute('disabled');
        authuserInput.setAttribute('class', 'success')
    }
    else {
        saveButton.setAttribute('disabled', 'disabled');
        authuserInput.setAttribute('class', 'error')
    }
}

function loadConfig() {
    var initialValue = chrome.storage.sync.get({
        authuser: '',
    }, function(result) {
        authuserInput.value = result.authuser;
        validateInput();
    });
}

loadConfig();
authuserInput.addEventListener("keyup", validateInput);
saveButton.addEventListener("click", saveConfig);