const saveButton = document.getElementById('save');
const authUserInput = document.getElementById('authuser');
const forceInput = document.getElementById('force');
const hideAuthUserInput = document.getElementById('hideAuthUser');
const savedSpan = document.getElementById('saved');

function saveConfig(e) {
    e.preventDefault();
    e.stopPropagation();

    saveButton.setAttribute("disabled", "disabled");
    savedSpan.innerText = chrome.i18n.getMessage("saveButtonSaving") || "Saving...";

    chrome.storage.sync.set({
        authuser: authUserInput.value,
        force: forceInput.checked === true,
        hideAuthUser: hideAuthUserInput.checked === true
    }, function() {
        savedSpan.innerText = chrome.i18n.getMessage("saveButtonSaved") || "Saved";

        setTimeout(function() {
            savedSpan.innerText = "";
            saveButton.removeAttribute("disabled");

            window.close();
        }, 750);
    });
}

function validateInput() {
    if (authUserInput.value === "" || /^\+?(0|[1-9]\d*)$/.test(authUserInput.value)) {
        saveButton.removeAttribute('disabled');
        authUserInput.classList.remove('invalid')
    }
    else {
        saveButton.setAttribute('disabled', 'disabled');
        authUserInput.classList.add('invalid')
    }
}

function loadConfig() {
    chrome.storage.sync.get({
        authuser: '',
        force: false,
        hideAuthUser: false
    }, function(result) {
        authUserInput.value = result.authuser;
        forceInput.checked = result.force;
        hideAuthUserInput.checked = result.hideAuthUser;
    });
}

function localizeHtmlPage() {
    const getMessage = tag => tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : '';
    });

    for (let obj of [...document.querySelectorAll('[data-localize]'), ...document.querySelectorAll('[data-placeholder-localize]')]) {
        if( obj.getAttribute('data-localize') ) {
            const msg = getMessage(obj.getAttribute('data-localize').toString());

            if( msg ) {
                obj.innerHTML = msg;
            }
        }

        if( obj.getAttribute('data-placeholder-localize') ) {
            const msg = getMessage(obj.getAttribute('data-placeholder-localize').toString());

            if( msg ) {
                obj.setAttribute('placeholder', msg);
            }
        }
    }
}

localizeHtmlPage();
loadConfig();

authUserInput.addEventListener("keyup", validateInput);
saveButton.addEventListener("click", saveConfig);