'use strict';

define(['jquery', 'purl'], function($, purl) {
    var key = 'AIzaSyCIBp_dCztnCozkp1Yeqxa9F70rcVpFn30';

    return {
        init: function youtubeBackgroundInit() {
            chrome.runtime.onMessage.addListener(function(request, sender, callback) {
                if (request.msg !== 'data' || request.provider !== 'youtube') {
                    return;
                }
                switch (request.content) {
                    case 'video':
                        $.ajax({ url:  'https://www.googleapis.com/youtube/v3/videos',
                                 data: { id:   request.id,
                                         part: 'snippet,statistics',
                                         key:  key } })
                            .done(function(response) {
                                response = response.items[0];
                                callback({ id:          request.id,
                                           image:       response.snippet.thumbnails.medium.url,
                                           name:        response.snippet.localized.title,
                                           description: response.snippet.localized.description,
                                           date:        Date.parse(response.snippet.publishedAt),
                                           views:       parseInt(response.statistics.viewCount),
                                           likes:       parseInt(response.statistics.likeCount),
                                           dislikes:    parseInt(response.statistics.dislikeCount),
                                           channelId:   response.snippet.channelId });
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                callback({ err: { status: jqXHR.status, error: errorThrown } });
                            });
                        return true;
                    case 'channel':
                        $.ajax({ url:  'https://www.googleapis.com/youtube/v3/channels',
                                 data: { id:   request.id,
                                         part: 'snippet,statistics',
                                         key:  key } })
                            .done(function(response) {
                                response = response.items[0];
                                callback({ id:          request.id,
                                           image:       response.snippet.thumbnails.medium.url,
                                           name:        response.snippet.localized.title,
                                           description: response.snippet.localized.description,
                                           videos:      parseInt(response.statistics.videoCount),
                                           views:       parseInt(response.statistics.viewCount),
                                           subscribers: parseInt(response.statistics.subscriberCount) });
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                callback({ err: { status: jqXHR.status, error: errorThrown } });
                            });
                        return true;
                    case 'comments-v2':
                        $.ajax({ url:  'https://gdata.youtube.com/feeds/api/videos/' + request.id + '/comments',
                                 data: { 'max-results': 5 } })
                            .done(function(response) {
                                response = $(response).children('feed');
                                callback({ id:       request.id,
                                           count:    parseInt(response.children('openSearch\\:totalResults').text()),
                                           comments: response.children('entry').map(function() {
                                               var entry = $(this);
                                               return { name:      entry.children('author').children('name').text(),
                                                        content:   entry.children('content').text(),
                                                        date:      Date.parse(entry.children('published').text()),
                                                        userId:    purl(entry.children('author').children('uri').text()).segment(-1),
                                                        channelId: entry.children('yt\\:channelId').text() };
                                           }).get() });
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                callback({ err: { status: jqXHR.status, error: errorThrown } });
                            });
                        return true;
                    case 'user-v2':
                        $.ajax({ url: 'https://gdata.youtube.com/feeds/api/users/' + request.id })
                            .done(function(response) {
                                callback({ id:    request.id,
                                           image: $(response).children('entry').children('media\\:thumbnail').attr('url') });
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                callback({ err: { status: jqXHR.status, error: errorThrown } });
                            });
                        return true;
                }
            });
        }
    };
});