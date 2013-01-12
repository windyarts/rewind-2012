/*global jQuery:true _:true data:true*/
(function ($) {
    'use strict';
    var $doc = $(document);
    var $win = $(window);
    var data = [];
    // Sharing
    window.Share = {
        url: 'http://www.wandoujia.com/2012rewind/best?utm_source=sharing&utm_campaign=2012rewind&utm_medium=',
        title: '豌豆荚 2012 Android 年度应用',
        weibo: function(title, url, pic) {
            window.open('http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&title=' + encodeURIComponent(title) + '&url='+encodeURIComponent(url + 'weibo')+'&pic='+encodeURIComponent(pic));
        },
        renren: function(title, url, pic) {
            window.open('http://widget.renren.com/dialog/share?title='+encodeURIComponent(title)+'&resourceUrl='+encodeURIComponent(url + 'renren')+'&pic='+encodeURIComponent(pic));
        },
        qq: function(title, url, pic) {
            window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+encodeURIComponent(title)+'&summary=aaa&pics='+encodeURIComponent(pic)+'&url='+encodeURIComponent(url + 'qq'));
        },
        google: function(url) {
            window.open('https://plus.google.com/share?url='+encodeURIComponent(url + 'google'));
        },
        facebook: function(title, url, pic) {
            window.open('https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D='+encodeURIComponent(title)+'&p%5Bsummary%5D='+encodeURIComponent(Share.title)+'&p%5Burl%5D='+encodeURIComponent(url + 'facebook')+'&p%5Bimages%5D%5B0%5D='+encodeURIComponent(pic));
        }
    };
    // Block
    if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
        $doc.on('mouseenter', '.block', function () {
                $(this).addClass('block-hover');
            })
            .on('mouseleave', '.block', function () {
                $(this).removeClass('block-hover');
            });
    }
    // Modal
    var modal = {};
    modal.$modal = $('[data-widget-modal]');
    modal.$panel = modal.$modal.find('[data-widget-panel]');
    modal.$panel.find('.close').on('click', function () {
        modal.close();
    });
    modal.close = function () {
        modal.$modal.hide();
    };
    modal.open = function () {
        modal.$modal
            .width($win.width())
            .height($doc.height());
        modal.$panel.css('top', $win.scrollTop() + 30);
        modal.$modal.show();
    };
    modal._changeScreenShot = function (goNext) {
        var visibleShots = modal.$panel.find('.slides > img:visible');
        var curIndex = visibleShots.attr('data-index') * 1;
        var next = curIndex + (goNext ? 1 : -1);
        next = (next + modal._data.screenshots.length) % modal._data.screenshots.length;
        visibleShots.hide();
        modal.$panel.find('.slides > img').eq(next).show();
    };
    modal.$panel.on('click', '.next', function () {
        modal._changeScreenShot(true);
    }).on('click', '.prev', function () {
        modal._changeScreenShot(false);
    });
    modal.$modal.on('click', function(e) {
        if (this === e.target) {
            modal.close();
        }
    });

    $doc.on('click', '[data-modal]', function (e) {
        e.preventDefault();
        var pn = $(this).attr('data-modal');
        var datum = _.chain(data).flatten(true).find(function (d) {
            return d.pn === pn;
        }).value();
        if (!datum) {
            return;
        }
        modal._data = datum;
        modal.$panel.find('.bd').html(_.template($('#tpl-modal').html(), {data: datum}));
        modal.open();
        ga('detail:' + datum.pn);
    }).on('click', '.preview', function(e) {
        var target = $(e.target);
        if (!target.hasClass('btn-install') && !target.hasClass('btn-detail')) {
            $(this).find('[data-modal]').click();
        }
    });

    // render
    $.ajax({
        dataType: 'json',
        url: meta.data,
        success: function(d) {
            data = d;
            $('[data-template-container]').html(_.template($('#tpl-group').html(), {groups: data}));
        }
    });

    // test
    // modal._data = data[0][0];
    // modal.$panel.find('.bd').html(_.template($('#tpl-modal').html(), {data: data[0][0]}));
    // modal.open();
})(jQuery);
