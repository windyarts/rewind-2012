/*global jQuery:true _:true data:true*/
(function ($) {
    'use strict';
    var $doc = $(document);
    var $win = $(window);
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
            .width($doc.width())
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
    });

    // render
    $('[data-template-container]').html(_.template($('#tpl-group').html(), {groups: data}));
    $('[data-spy="affix"]').each(function () {
        var $spy = $(this),
            data = $spy.data();

        data.offset = data.offset || {};

        data.offsetBottom && (data.offset.bottom = data.offsetBottom);
        data.offsetTop && (data.offset.top = data.offsetTop);
console.log($spy);
        $spy.affix(data);
    });
    // test
    // modal._data = data[0][0];
    // modal.$panel.find('.bd').html(_.template($('#tpl-modal').html(), {data: data[0][0]}));
    // modal.open();
})(jQuery);
