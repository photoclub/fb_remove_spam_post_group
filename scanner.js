var _ban_list = [];
var _delete_list = [];

if (/groups/.test(window.location.href) && /pending/.test(window.location.href)) {
    setTimeout(function () {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(run, 5000);
    }, 1000);
}

function run() {
    chrome.storage.sync.get({
        option_type: false
    }, function (items) {
        if (items.option_type === false) return null; // option scan not enable
        _grab_data(); // lấy danh sách xóa và ban
        _process(); // xử lý post

        setTimeout(function () {
            window.location.reload();
        }, 30000);
    });
}

/**
 * lấy dữ liệu để xử lý
 * @private
 */
function _grab_data() {
    var feeds = $('div#pagelet_pending_queue div[role=feed] > div');
    for (var i = 0; i < feeds.length; i++) {
        var post = feeds.eq(i);
        var html = post.html();
        var text = post.text();

		if(/img sp_lLy5ll4_TNH sx_dd416f/.test(html)) continue; // banned

        if (/is live now/.test(text) && /class="mtm _5pcm"/.test(html)) _ban_list.push(post);
		if (/UnavailableThis/.test(text) || /class="mtm _5pcm"/.test(html)) _delete_list.push(post);
    }
}

function _process() {

    if (_ban_list.length === 0 && _delete_list.length === 0) return null;

    // xử lý xóa bài và ban nick
    if (_ban_list.length > 0) {
        // click ban
        var banBtn = $(_ban_list[0]).find('div.uiPopover > a')[0];
        window.scrollTo(0, banBtn.offsetTop);
        banBtn.click();
        setTimeout(function () {
            $('a[ajaxify^="/ajax/groups/mall/delete_and_ban_member"]')[0].click();
            setTimeout(function () {
                $('.uiInputLabelCheckbox')[0].click();
                $('.layerConfirm').click();
                setTimeout(function () {
                    $('button[data-testid=delete_post_confirm_button]')[0].click();
                    setTimeout(function () {
                        chrome.storage.sync.get({
                            nick_counter: 0
                        }, function (items) {
                            chrome.storage.sync.set({nick_counter: items.nick_counter + 1}, function () { 
								setTimeout(function(){
									window.location.reload(true);
								}, 1000);
                            });
                        });
                    }, 2000);
                }, 1000);
            }, 2000);
        }, 1000);
    }

    if (_delete_list.length > 0) {
        // click delete
        var delBtn = $(_delete_list[0]).find('a[ajaxify^="/ajax/groups/mall/delete/"]')[0];
        window.scrollTo(0, delBtn.offsetTop);
        delBtn.click();
        setTimeout(function () {
            $('button[data-testid=delete_post_confirm_button]')[0].click();
            setTimeout(function () {
                chrome.storage.sync.get({
                    post_counter: 0
                }, function (items) {
                    chrome.storage.sync.set({post_counter: items.post_counter + 1}, function () {
                        window.location.reload(true);
                    });
                });
            }, 3000);
        }, 2000);
    }

}
