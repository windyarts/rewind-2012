/*global jQuery:true _:true data:true*/
(function ($) {
    'use strict';
    // Modal
    var $doc = $(document);
    var $win = $(window);
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
    modal._changeScreenShot = function(goNext) {
        var visibleShots = modal.$panel.find('.slides > img:visible');
        var curIndex = visibleShots.attr('data-index') * 1;
        var next = curIndex + (goNext ? 1 : -1);
        next = (next + modal._data.screenshots.length) % modal._data.screenshots.length;
        visibleShots.hide();
        modal.$panel.find('.slides > img').eq(next).show();
    };
    modal.$panel.on('click', '.next', function() {
        modal._changeScreenShot(true);
    }).on('click', '.prev', function() {
        modal._changeScreenShot(false);
    });

    $doc.on('click', '[data-modal]', function (e) {
        e.preventDefault();
        var pn = $(this).attr('data-modal');
        console.log(pn);
        var datum = _.chain(data).flatten(true).find(function (d) {
            return d.pn === pn;
        }).value();
        console.log(datum);
        if (!datum) {
            return;
        }
        modal._data = datum;
        modal.$panel.find('.bd').html(_.template($('#tpl-modal').html(), {data: datum}));
        modal.open();
    });

    // render
    $('[data-template-container]').html(_.template($('#tpl-group').html(), {groups: data}));
})(jQuery);
