var background = chrome.extension.getBackgroundPage();
function save_options() {
    var number = (document.getElementById('numberOfQuery').value > 20) ? 20 : document.getElementById('numberOfQuery').value;
    chrome.storage.sync.set({
        queryNumber: number
    }, function() {
        background.restore_options();
        document.getElementById('numberOfQuery').value = number;

        var status = document.getElementById('status');
        status.textContent = 'Einstellung wurde gespeichert';
        setTimeout(function() {
            status.textContent = '';
        }, 1500);
    });
}

function restore_options() {
    chrome.storage.sync.get(null, (items) => {
        document.getElementById('numberOfQuery').value = items.queryNumber;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("btnSave").addEventListener('click',save_options);