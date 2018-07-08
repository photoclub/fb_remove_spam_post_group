var option_type = document.getElementById('option_type');
var nick_counter = document.getElementById('nick_counter');
var post_counter = document.getElementById('post_counter');
var progress = document.getElementById('progress');

function save_options() {
    chrome.storage.sync.set({
        option_type: option_type.checked
    }, function () {
        var status = document.getElementById('status');
        status.style.display = 'block';
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.style.display = 'none';
            status.textContent = '';
        }, 200);
    });
    setTimeout(function () {
        progress.style.display = option_type.checked === true ? 'block' : 'none';
    }, 500);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    progress.style.display = 'none';
    chrome.storage.sync.get({
        option_type: false
    }, function (items) {
        document.getElementById('option_type').checked = items.option_type;
        progress.style.display = items.option_type === true ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

bind_statistic();

function bind_statistic() {
    chrome.storage.sync.get({nick_counter: 0, post_counter: 0}, function (items) {
        nick_counter.innerHTML = items.nick_counter;
        post_counter.innerHTML = items.post_counter;
    });
    setTimeout(bind_statistic, 1000);
}
