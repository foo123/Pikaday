/*!
 * Pikadaytime jQuery plugin.
 *
 * Copyright © 2013 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

!function(root, factory) {
'use strict';

if (typeof exports === 'object') {
    // CommonJS module
    factory(require('jquery'), require('../pikadaytime'));
} else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'pikadaytime'], factory);
} else {
    // Browser globals
    factory(root.jQuery, root.Pikadaytime);
}
}(this, function($, Pikadaytime) {
'use strict';

$.fn.pikadaytime = function( ) {
    var args = arguments;

    if (!args || !args.length) {
        args = [{ }];
    }

    return this.each(function()
    {
        var self   = $(this),
            plugin = self.data('pikadaytime');

        if (!(plugin instanceof Pikadaytime)) {
            if (typeof args[0] === 'object') {
                var options = $.extend({}, args[0]);
                options.field = self[0];
                self.data('pikadaytime', new Pikadaytime(options));
            }
        } else {
            if (typeof args[0] === 'string' && typeof plugin[args[0]] === 'function') {
                plugin[args[0]].apply(plugin, Array.prototype.slice.call(args,1));

                if (args[0] === 'destroy') {
                    self.removeData('pikadaytime');
                }
            }
        }
    });
};

});
