saveButton = document.getElementById('save');
authuserInput = document.getElementById('authuser');
forceInput = document.getElementById('force');

function saveConfig() {
    chrome.storage.sync.set({
        authuser: authuserInput.value,
        force: forceInput.checked === true
    }, function() {
        saveButton.setAttribute('class', 'button success');
        saveButton.innerHTML = "Saved";

        chrome.extension.getBackgroundPage().authUser = authuserInput.value;
        chrome.extension.getBackgroundPage().force = forceInput.checked === true;

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
    chrome.storage.sync.get({
        authuser: '',
        force: false
    }, function(result) {
        authuserInput.value = result.authuser;
        forceInput.checked = result.force;

        validateInput();
    });
}

loadConfig();
authuserInput.addEventListener("keyup", validateInput);
saveButton.addEventListener("click", saveConfig);