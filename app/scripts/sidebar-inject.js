var $ = require('jquery');

module.exports = function sidebarInjectOn(inject_into, body, dbl_clickable) {
    inject_into = $(inject_into);
    body = $(body);
    dbl_clickable = $(dbl_clickable)
        .dblclick(function() {
            window.postMessage({ msg: 'hide' }, '*');
        });

    var obj = $('<div class="hovercards-sidebar"></div>')
        .appendTo(inject_into)
        .hide()
        .on('animationend MSAnimationEnd webkitAnimationEnd oAnimationEnd', function(e) {
            if (e.originalEvent.animationName !== 'slide-out-hovercards') {
                return;
            }
            obj.hide();
        })
        .on('sidebar.msg', function(e, request) {
            switch (request.msg) {
                case 'load':
                    obj
                        .show()
                        .removeClass('hovercards-sidebar-leave')
                        .addClass('hovercards-sidebar-enter');
                    window.postMessage({ msg: 'loaded' }, '*');
                    break;
                case 'hide':
                    obj
                        .removeClass('hovercards-sidebar-enter')
                        .addClass('hovercards-sidebar-leave');
                    window.postMessage({ msg: 'hidden' }, '*');
                    break;
            }
        });

    $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        .appendTo(obj)
        .prop('src', chrome.extension.getURL('sidebar.html'))
        .prop('frameborder', '0')
        .mouseenter(function() {
            body.css('overflow', 'hidden');
        })
        .mouseleave(function() {
            body.css('overflow', 'auto');
        });

    $('<div class="hovercards-sidebar-close-button"></div>')
        .appendTo(obj)
        .click(function(e) {
            if (e.which !== 1) {
                return;
            }
            window.postMessage({ msg: 'hide' }, '*');
        });

    return obj;
};
