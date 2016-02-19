/**
 * 统一定制easyui window方法扩展
 *
 */
/*jslint browser: true, devel: true, white: true*/
/*global jQuery*/
/*jslint this*/
(function($) {
    'use strict';
    var originWindow = $.fn.window; // 保留原window方法

    if (!originWindow) {
        return;
    }
    function customMethod(target) { // 自定义方法
        // var opts = $.extend(true, {}, $.fn.window.defaults, $(target).window('options'));
        $(target).window('addEventListener', [{
            name: 'onMove', // onBeforeOpen, onClose, onMove, onResize, onRestore, onExpand, onCollapse, onMaximize, onMinimize...
            handler: function() { // 例1：当window移动追加console显示
                console.log('Moving now...');
            }
        }, {
            name: 'onBeforeOpen',
            override: true,
            handler: function() { // 例2：当window打开前追加console显示
                console.log('Before!~');
            }
        }]);
    }
    $.extend($.fn.window.methods, { // 扩展方法
        addEventListener: function(jq, args) {
            return jq.each(function() {
                var eventList = $.isArray(args) ? args : [args];
                var target = this;
                var opts = $(target).panel('options');

                $.each(eventList, function(ignore, evt) {
                    var originEvent = opts[evt.name];

                    evt.handler = evt.handler || function() {};
                    if (evt.override) {
                        opts[evt.name] = evt.handler;
                    } else {
                        opts[evt.name] = function() {
                            originEvent.apply(this, arguments);
                            evt.handler.apply(this, arguments);
                        };
                    }
                });
            });
        }
    });
    $.fn.window = function(opts, args) { // 覆写easyui window方法
        if (typeof opts !== 'string') {
            return this.each(function() {
                originWindow.call($(this), opts, args);
                customMethod(this);
            });
        } else {
            return originWindow.call(this, opts, args);
        }
    };
    $.fn.window.methods = originWindow.methods;
    $.fn.window.defaults = originWindow.defaults;
    $.fn.window.parseOptions = originWindow.parseOptions;
}(jQuery));