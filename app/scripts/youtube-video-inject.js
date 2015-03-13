'use strict';

define('youtube-video-inject', ['jquery'], function($) {
    function injectButtonOnPlayer(body) {
        require(['youtube-video-button'], function(youtubeVideoButton) {
            /* globals purl:true */
            youtubeVideoButton(body.children('#player'), purl(document.URL).segment(-1)).prependTo(body);
        });
    }

    function injectButtonsOnObjectsAndEmbeds(body) {
        require(['youtube-video-button'], function(youtubeVideoButton) {
            body
                .find('object[data*="youtube.com/v/"], embed[src*="youtube.com/v/"]')
                .each(function() {
                    /* globals purl:true */
                    var video = $(this);
                    youtubeVideoButton(video, purl(video.prop('data') || video.prop('src')).segment(-1)).insertBefore(video);
                });
        });
    }

    function injectTriggersOnLinks(body) {
        require(['trigger'], function(trigger) {
            var youtubeLinkSelector = 'a[href*="youtube.com/watch"]';
            if (purl(document.URL).attr('host') === 'www.youtube.com') {
                youtubeLinkSelector += ',a[href^="/watch"]';
            }
            body
                .find(youtubeLinkSelector)
                .each(function() {
                    /* globals purl:true */
                    var link = $(this);
                    trigger(link, 'youtube-video', purl(link.attr('href')).param('v'));
                });
            body
                .find('a[href*="youtu.be/"]')
                .each(function() {
                    /* globals purl:true */
                    var link = $(this);
                    trigger(link, 'youtube-video', purl(link.attr('href')).segment(-1));
                });
        });
    }

    return function youtubeVideoInject(body, context) {
        if (!body) {
            body = 'body';
        }
        body = $(body);
        switch (context) {
            case '#player':
                injectButtonOnPlayer(body);
                break;
            case 'objects':
                injectButtonsOnObjectsAndEmbeds(body);
                break;
            default:
                injectButtonsOnObjectsAndEmbeds(body);
                injectTriggersOnLinks(body);
                break;
        }
    };
});
