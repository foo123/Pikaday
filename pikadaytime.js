/**
* Pikadaytime
* https://github.com/foo123/Pikadaytime
* @version 2.0.0
*
* adapted from: 
* Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday, https://github.com/owenmead/Pikaday
**/
!function( root, name, factory ) {
"use strict";
if ( 'object' === typeof exports )
    // CommonJS module
    module.exports = factory( );
else if ( 'function' === typeof define && define.amd )
    // AMD. Register as an anonymous module.
    define(function( req ) { return factory( ); });
else
    root[name] = factory( );
}(this, 'Pikadaytime', function( ) {
"use strict";

var
/**
 * feature detection and helper functions
 */
hasEventListeners = !!window.addEventListener,

document = window.document,

sto = window.setTimeout,

addEvent = function(el, e, callback, capture) {
    if (hasEventListeners) {
        el.addEventListener(e, callback, !!capture);
    } else {
        el.attachEvent('on' + e, callback);
    }
},

removeEvent = function(el, e, callback, capture) {
    if (hasEventListeners) {
        el.removeEventListener(e, callback, !!capture);
    } else {
        el.detachEvent('on' + e, callback);
    }
},

fireEvent = function(el, eventName, data) {
    var ev;

    if (document.createEvent) {
        ev = document.createEvent('HTMLEvents');
        ev.initEvent(eventName, true, false);
        ev = extend(ev, data);
        el.dispatchEvent(ev);
    } else if (document.createEventObject) {
        ev = document.createEventObject();
        ev = extend(ev, data);
        el.fireEvent('on' + eventName, ev);
    }
},

trim_re = /^\s+|\s+$/g,
trim = String.prototype.trim
    ? function( s ) { return s.trim(); }
    : function( s ){ return s.replace(trim_re,''); }
,

hasClass = function( el, className ) {
    return el.classList
        ? el.classList.contains(className)
        : -1 !== (' ' + el.className + ' ').indexOf(' ' + className + ' ')
    ;
},

addClass = function( el, className ) {
    if ( !hasClass(el, className) )
    {
        if ( el.classList ) el.classList.add(className);
        else el.className = '' === el.className ? className : el.className + ' ' + className;
    }
},

removeClass = function( el, className ) {
    if ( el.classList ) el.classList.remove(className);
    else el.className = trim((' ' + el.className + ' ').replace(' ' + className + ' ', ' '));
},

isArray = function(obj) {
    return (null != obj) && ('[object Array]' === toString.call(obj));
},

isDate = function(obj) {
    return (null != obj) && ('[object Date]' === toString.call(obj)) && !isNaN(obj.getTime());
},

isLeapYear = function(year) {
    // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    return (0 === year % 4) && (0 !== year % 100) || (0 === year % 400);
},

getDaysInMonth = function(year, month) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
},

setToStartOfDay = function(date, with_time, with_seconds) {
    if ( with_time )
    {
        date.setMilliseconds(0);
        if ( !with_seconds ) date.setSeconds(0);
    }
    else
    {
        date.setHours(0,0,0,0);
    }
},

defaultEncoder = function( d, pikaday ) {
    return pikaday._o.showTime ? d.toString( ) : d.toDateString( );
},

defaultDecoder = function( d, pikaday ) {
    return new Date( Date.parse( d ) );
},

extend = function(to, from, overwrite) {
    var prop, hasProp;
    for (prop in from) {
        hasProp = to[prop] !== undefined;
        if (hasProp && typeof from[prop] === 'object' && from[prop].nodeName === undefined) {
            if (isDate(from[prop])) {
                if (overwrite) {
                    to[prop] = new Date(from[prop].getTime());
                }
            }
            else if (isArray(from[prop])) {
                if (overwrite) {
                    to[prop] = from[prop].slice(0);
                }
            } else {
                to[prop] = extend({}, from[prop], overwrite);
            }
        } else if (overwrite || !hasProp) {
            to[prop] = from[prop];
        }
    }
    return to;
},

adjustCalendar = function(calendar) {
    if (calendar.month < 0) {
        calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
        calendar.month += 12;
    }
    if (calendar.month > 11) {
        calendar.year += Math.floor(Math.abs(calendar.month)/12);
        calendar.month -= 12;
    }
    return calendar;
},

/**
 * defaults and localisation
 */
defaults = {

    // bind the picker to a form field
    field: null,

    // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
    bound: undefined,

    // position of the datepicker, relative to the field (default to bottom & left)
    // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
    position: 'bottom left',

    // the default output format for `.toString()` and `field` value
    format: 'Y-m-d H:i:s',

    // the initial date to view when first opened
    defaultDate: null,

    // make the `defaultDate` the initial selected value
    setDefaultDate: false,

    // first day of week (0: Sunday, 1: Monday etc)
    firstDay: 0,

    // the minimum/earliest date that can be selected
    minDate: null,
    // the maximum/latest date that can be selected
    maxDate: null,

    // number of years either side, or array of upper/lower range
    yearRange: 10,

    // show week numbers at head of row
    showWeekNumber: false,

    // used internally (don't config outside)
    minYear: 0,
    maxYear: 9999,
    minMonth: undefined,
    maxMonth: undefined,

    isRTL: false,

    // Additional text to append to the year in the calendar title
    yearSuffix: '',

    // Render the month after year in the calendar title
    showMonthAfterYear: false,

    // how many months are visible
    numberOfMonths: 1,

    // time
    showTime: true,
    showSeconds: true,
    
    // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
    // only used for the first display or when a selected date is not visible
    mainCalendar: 'left',

    // Specify a DOM element to render the calendar in
    container: undefined,

    // internationalization
    i18n: {
        AM            : 'am',
        PM            : 'pm',
        hours         : 'Hours',
        minutes       : 'Minutes',
        seconds       : 'Seconds',
        previousMonth : 'Previous Month',
        nextMonth     : 'Next Month',
        months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
        weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    },

    // callback function
    onSelect: null,
    onOpen: null,
    onClose: null,
    onDraw: null,
    
    // custom date codecs, not depend just on moment lib
    encoder: false,
    decoder: false
},


/**
 * templating functions to abstract HTML rendering
 */
renderDayName = function(opts, day, abbr) {
    day += opts.firstDay;
    if ( day >= 7 ) day %= 7;
    return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
},

renderDay = function(d, m, y, isSelected, isToday, isDisabled, isEmpty) {
    if (isEmpty) {
        return '<td class="is-empty"></td>';
    }
    var arr = [];
    if (isDisabled) {
        arr.push('is-disabled');
    }
    if (isToday) {
        arr.push('is-today');
    }
    if (isSelected) {
        arr.push('is-selected');
    }
    return '<td data-day="' + d + '" class="' + arr.join(' ') + '">' +
             '<button class="pika-button pika-day" type="button" ' +
                'data-pika-year="' + y + '" data-pika-month="' + m + '" data-pika-day="' + d + '">' +
                    d +
             '</button>' +
           '</td>';
},

renderWeek = function (d, m, y) {
    // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
    var onejan = new Date(y, 0, 1),
        weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
    return '<td class="pika-week">' + weekNum + '</td>';
},

renderRow = function(days, isRTL) {
    return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
},

renderBody = function(rows) {
    return '<tbody>' + rows.join('') + '</tbody>';
},

renderHead = function(opts) {
    var i, arr = [];
    if (opts.showWeekNumber) {
        arr.push('<th></th>');
    }
    for (i = 0; i < 7; i++) {
        arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
    }
    return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
},

renderTitle = function(instance, c, year, month, refYear) {
    var i, j, arr,
        opts = instance._o,
        isMinYear = year === opts.minYear,
        isMaxYear = year === opts.maxYear,
        html = '<div class="pika-title">',
        monthHtml,
        yearHtml,
        prev = true,
        next = true;

    for (arr = [], i = 0; i < 12; i++) {
        arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
            (i === month ? ' selected': '') +
            ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
            opts.i18n.months[i] + '</option>');
    }
    monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month">' + arr.join('') + '</select></div>';

    if (isArray(opts.yearRange)) {
        i = opts.yearRange[0];
        j = opts.yearRange[1] + 1;
    } else {
        i = year - opts.yearRange;
        j = 1 + year + opts.yearRange;
    }

    for (arr = []; i < j && i <= opts.maxYear; i++) {
        if (i >= opts.minYear) {
            arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
        }
    }
    yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year">' + arr.join('') + '</select></div>';

    if (opts.showMonthAfterYear) {
        html += yearHtml + monthHtml;
    } else {
        html += monthHtml + yearHtml;
    }

    if (isMinYear && (month === 0 || opts.minMonth >= month)) {
        prev = false;
    }

    if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
        next = false;
    }

    if (c === 0) {
        html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
    }
    if (c === (instance._o.numberOfMonths - 1) ) {
        html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
    }

    return html += '</div>';
},

renderTable = function(opts, data) {
    return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
},

renderTimePicker = function(num_options, selected_val, select_class, display_func, title) {
    var to_return = '<td><select title="'+title+'" class="pika-select '+select_class+'">';
    for (var i=0; i<num_options; i++) {
    to_return += '<option value="'+i+'" '+(i==selected_val ? 'selected' : '')+'>'+display_func(i)+'</option>'
    }
    to_return += '</select></td>';
    return to_return;
},

double_digit = function( i ) { return (i < 10 ?"0":"") + i; },

renderTime = function(hh, mm, ss, opts) {
    var to_return = '<table cellpadding="0" cellspacing="0" class="pika-time"><tbody><tr>' +
    renderTimePicker(24, hh, 'pika-select-hour', false !== opts.hour24
    ? double_digit
    : function( i ) { return (i%12) + ' ' + (i<12 ? opts.i18n.AM : opts.i18n.PM); }
    , opts.i18n.hours) +
    '<td><span class="pika-time-sep">:</span></td>' +
    renderTimePicker(60, mm, 'pika-select-minute', double_digit, opts.i18n.minutes) +
    (opts.showSeconds ? ('<td><span class="pika-time-sep">:</span></td>' +
    renderTimePicker(60, ss, 'pika-select-second', double_digit, opts.i18n.seconds)) : '') +
    '</tr></tbody></table>';
    return to_return;
},


/**
 * Pikadaytime constructor
 */
Pikadaytime = function Pikadaytime( options ) {
    options = options || {};
    
    var self = this,
        opts = self.config(options);

    self._t_update = false;
    self._onMouseDown = function(e) {
        if ( !self._v ) return;
        e = e || window.event;
        var target = e.target || e.srcElement;
        if ( !target ) return;

        if ( !hasClass(target, 'is-disabled') )
        {
            if ( hasClass(target, 'pika-button') && !hasClass(target, 'is-empty') )
            {
                var newDate = new Date(
                        target.getAttribute('data-pika-year'),
                        target.getAttribute('data-pika-month'),
                        target.getAttribute('data-pika-day'),
                        // Preserve time selection when date changed
                        opts.showTime ? self.el.querySelector('.pika-select-hour').selectedIndex : 0,
                        opts.showTime ? self.el.querySelector('.pika-select-minute').selectedIndex : 0,
                        opts.showTime && opts.showSeconds ? self.el.querySelector('.pika-select-second').selectedIndex : 0,
                        0
                    );
                
                self.setDate( newDate );
                
                if ( opts.bound )
                {
                    sto(function() {
                        self.hide();
                        if ( opts.field ) opts.field.blur( );
                    }, 100);
                }
                return;
            }
            else if ( hasClass(target, 'pika-prev') )
            {
                self.prevMonth( );
            }
            else if ( hasClass(target, 'pika-next') )
            {
                self.nextMonth( );
            }
        }
        if ( !hasClass(target, 'pika-select') )
        {
            if ( e.preventDefault )
            {
                e.preventDefault();
            }
            else
            {
                e.returnValue = false;
                return false;
            }
        }
        else
        {
            self._c = true;
        }
    };

    self._onChange = function( e ) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if ( !target ) return;
        if ( hasClass(target, 'pika-select-month') ) self.gotoMonth(target.value);
        else if ( hasClass(target, 'pika-select-year') ) self.gotoYear(target.value);
        else if ( hasClass(target, 'pika-select-hour') ) self.setTime(target.value);
        else if ( hasClass(target, 'pika-select-minute') ) self.setTime(null, target.value);
        else if ( hasClass(target, 'pika-select-second') ) self.setTime(null, null, target.value);
    };

    self._onInputChange = function( e ) {
        var date;
        if ( e.firedBy === self ) return;
        date = opts.decoder( opts.field.value, self );
        self.setDate( date );
        if ( !self._v ) self.show();
    };

    self._onInputFocus = function( ) {
        self.show();
    };

    self._onInputClick = function( ) {
        self.show();
    };

    self._onInputBlur = function( ) {
        if ( !self._c )
        {
            self._b = sto(function() {
                self.hide();
            }, 50);
        }
        self._c = false;
    };

    self._onClick = function( e ) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            pEl = target;
        if ( !target ) return;
        if ( !hasEventListeners && hasClass(target, 'pika-select') )
        {
            if ( !target.onchange )
            {
                target.setAttribute('onchange', 'return;');
                addEvent(target, 'change', self._onChange);
            }
        }
        do {
            if ( hasClass(pEl, 'pika-single') ||
                (opts.showTime && hasClass(pEl, 'pika-time-container'))
            )
                return;
        } while ( (pEl = pEl.parentNode) );
        if ( self._v && target !== opts.trigger ) self.hide();
    };

    self.el = document.createElement('div');
    self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '');

    addEvent(self.el, 'mousedown', self._onMouseDown, true);
    addEvent(self.el, 'change', self._onChange);

    if ( opts.field )
    {
        if ( opts.container ) opts.container.appendChild(self.el);
        else if ( opts.bound ) document.body.appendChild(self.el);
        else opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
        addEvent(opts.field, 'change', self._onInputChange);

        if ( !opts.defaultDate )
        {
            opts.defaultDate = opts.decoder( opts.field.value, self );
            opts.setDefaultDate = true;
        }
    }

    var defDate = opts.defaultDate;

    if ( isDate(defDate) )
    {
        if ( opts.setDefaultDate ) self.setDate(defDate, true);
        else self.gotoDate(defDate);
    }
    else
    {
        self.gotoDate(new Date());
    }

    if ( opts.bound )
    {
        self.hide();
        self.el.className += ' is-bound';
        addEvent(opts.trigger, 'click', self._onInputClick);
        addEvent(opts.trigger, 'focus', self._onInputFocus);
        addEvent(opts.trigger, 'blur', self._onInputBlur);
    }
    else
    {
        self.show();
    }
};

Pikadaytime.VERSION = '2.0.0';

/**
 * public Pikaday API
 */
Pikadaytime.prototype = {

    constructor: Pikadaytime,
    
    /**
     * configure functionality
     */
    config: function( options ) {
        var self = this;
        if ( !self._o ) self._o = extend({}, defaults, true);

        var opts = extend(self._o, options, true);
        
        if ( !opts.encoder || 'function' !== typeof(opts.encoder) ) opts.encoder = defaultEncoder;
        if ( !opts.decoder || 'function' !== typeof(opts.decoder) ) opts.decoder = defaultDecoder;

        opts.isRTL = !!opts.isRTL;
        
        opts.showTime = !!opts.showTime;
        opts.showSeconds = !!opts.showSeconds;

        opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

        opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

        opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

        var nom = parseInt(opts.numberOfMonths||0, 10) || 1;
        opts.numberOfMonths = nom > 4 ? 4 : nom;

        if ( !isDate(opts.minDate) ) opts.minDate = false;
        if ( !isDate(opts.maxDate) ) opts.maxDate = false;
        if ( (opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate ) opts.maxDate = opts.minDate = false;
        if ( opts.minDate ) self.setMinDate( opts.minDate );
        if ( opts.maxDate ) self.setMaxDate( opts.maxDate );

        if ( isArray(opts.yearRange) )
        {
            var fallback = new Date().getFullYear() - 10;
            opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
            opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
        }
        else
        {
            opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
            if ( opts.yearRange > 100 ) opts.yearRange = 100;
        }
        return opts;
    },

    /**
     * return a formatted string of the current selection (using Moment.js if available)
     */
    toString: function( format ) {
        return isDate(this._d) ? this._o.encoder( this._d, this ) : '';
    },

    /**
     * return a Date object of the current selection
     */
    getDate: function( ) {
        return isDate(this._d) ? new Date(this._d.getTime()) : null;
    },

    /**
     * set time components
     * Currently defaulting to setting date to today if not set
     */
    setTime: function( hours, minutes, seconds ) {
        var self = this, date, showTime = self._o.showTime, showSeconds = self._o.showSeconds, f;
        self._t_update = true;
        if ( self._d )
        {
            // dynamicaly update UI, instead of re-draw
            date = self._d;
            if  (null != hours )
            {
                hours = parseInt(hours, 10) || 0;
                date.setHours( hours );
                if ( showTime && (f=self.el.querySelector('.pika-select-hour')) )
                    f.options[hours].selected = true;
            }
            if ( null != minutes )
            {
                minutes = parseInt(minutes, 10) || 0;
                date.setMinutes( minutes );
                if ( showTime && (f=self.el.querySelector('.pika-select-minute')) )
                    f.options[minutes].selected = true;
            }
            if ( null != seconds )
            {
                seconds = parseInt(seconds, 10) || 0;
                date.setSeconds( seconds );
                if ( showTime && showSeconds && (f=self.el.querySelector('.pika-select-second')) )
                    f.options[seconds].selected = true;
            }
        }
        else
        {
            date = new Date( );
            date.setHours(
            null != hours ? parseInt(hours,10)||0 : 0,
            null != minutes ? parseInt(minutes,10)||0 : 0,
            null != seconds ? parseInt(seconds,10)||0 : 0,
            0);
            self.setDate( date );
        }
    },

    /**
     * set the current selection
     */
    setDate: function( date, preventOnSelect ) {
        var self = this;
        if ( 'string' === typeof date ) date = self._o.decoder( date, self );
        if ( !isDate( date ) ) date = null;
        
        self._t_update = false;
        
        if ( !date )
        {
            self._d = null;

            if ( self._o.field )
            {
                self._o.field.value = '';
                fireEvent(self._o.field, 'change', { firedBy: self });
            }
            return self.draw( );
        }

        var min = self._o.minDate,
            max = self._o.maxDate;

        if ( isDate(min) && date < min ) date = min;
        else if ( isDate(max) && date > max ) date = max;

        self._d = new Date( date.getTime() );
        setToStartOfDay( self._d, self._o.showTime, self._o.showSeconds );
        self.gotoDate( self._d );

        if ( self._o.field )
        {
            self._o.field.value = self.toString();
            fireEvent(self._o.field, 'change', { firedBy: self });
        }
        if ( !preventOnSelect && 'function' === typeof self._o.onSelect )
            self._o.onSelect.call(self, self.getDate());
    },

    /**
     * change view to a specific date
     */
    gotoDate: function( date ) {
        var self = this, newCalendar = true;

        if ( !isDate(date) ) return;

        date = new Date(date.getTime());
        setToStartOfDay( date );
        
        if ( self.calendars )
        {
            var firstVisibleDate = new Date(self.calendars[0].year, self.calendars[0].month, 1),
                lastVisibleDate = new Date(self.calendars[self.calendars.length-1].year, self.calendars[self.calendars.length-1].month, 1),
                visibleDate = date.getTime();
            // get the end of the month
            lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
            lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
            newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
        }

        if ( newCalendar )
        {
            self.calendars = [{
                month: date.getMonth(),
                year: date.getFullYear()
            }];
            if ( 'right' === self._o.mainCalendar )
                self.calendars[0].month += 1 - self._o.numberOfMonths;
        }
        self.adjustCalendars( );
    },

    adjustCalendars: function( ) {
        var self = this;
        self.calendars[0] = adjustCalendar(self.calendars[0]);
        for (var c = 1; c < self._o.numberOfMonths; c++)
        {
            self.calendars[c] = adjustCalendar({
                month: self.calendars[0].month + c,
                year: self.calendars[0].year
            });
        }
        self.draw();
    },

    gotoToday: function( ) {
        this.gotoDate(new Date());
    },

    /**
     * change view to a specific month (zero-index, e.g. 0: January)
     */
    gotoMonth: function( month ) {
        if ( !isNaN(month) )
        {
            this.calendars[0].month = parseInt(month, 10);
            this.adjustCalendars( );
        }
    },

    nextMonth: function( ) {
        this.calendars[0].month++;
        this.adjustCalendars();
    },

    prevMonth: function( ) {
        this.calendars[0].month--;
        this.adjustCalendars();
    },

    /**
     * change view to a specific full year (e.g. "2012")
     */
    gotoYear: function( year ) {
        if ( !isNaN(year) )
        {
            this.calendars[0].year = parseInt(year, 10);
            this.adjustCalendars();
        }
    },

    /**
     * change the minDate
     */
    setMinDate: function( value ) {
        var self = this;
        if ( !isDate(value) ) return;
        setToStartOfDay( value, self._o.showTime, self._o.showSeconds );
        self._o.minDate = value;
        self._o.minYear  = value.getFullYear();
        self._o.minMonth = value.getMonth();
    },

    /**
     * change the maxDate
     */
    setMaxDate: function( value ) {
        var self = this;
        if ( !isDate(value) ) return;
        setToStartOfDay( value, self._o.showTime, self._o.showSeconds );
        self._o.maxDate = value;
        self._o.maxYear  = value.getFullYear();
        self._o.maxMonth = value.getMonth();
    },

    /**
     * refresh the HTML
     */
    draw: function( force ) {
        var self = this;
        if ( !self._v && !force ) return;
        var opts = self._o,
            minYear = opts.minYear,
            maxYear = opts.maxYear,
            minMonth = opts.minMonth,
            maxMonth = opts.maxMonth,
            is_date = !!self._d,
            html = '';

        if ( self._y <= minYear )
        {
            self._y = minYear;
            if ( !isNaN(minMonth) && self._m < minMonth ) self._m = minMonth;
        }
        if ( self._y >= maxYear )
        {
            self._y = maxYear;
            if ( !isNaN(maxMonth) && self._m > maxMonth ) self._m = maxMonth;
        }

        for (var c = 0; c < opts.numberOfMonths; c++)
        {
            html += '<div class="pika-lendar">' + renderTitle(self, c, self.calendars[c].year, self.calendars[c].month, self.calendars[0].year) + self.render(self.calendars[c].year, self.calendars[c].month) + '</div>';
        }

        if ( opts.showTime )
        {
            html += '<div class="pika-time-container">' +
                    renderTime(
                        is_date ? self._d.getHours() : 0,
                        is_date ? self._d.getMinutes() : 0,
                        is_date && opts.showSeconds ? self._d.getSeconds() : 0,
                        opts)
                + '</div>';
        }
        
        self.el.innerHTML = html;

        if ( opts.bound )
        {
            if( 'hidden' !== opts.field.type )
            {
                sto(function() {
                    opts.trigger.focus();
                }, 1);
            }
        }

        if ( 'function' === typeof self._o.onDraw )
        {
            sto(function() {
                self._o.onDraw.call(self);
            }, 0);
        }
    },

    adjustPosition: function( ) {
        var self = this;
        if ( self._o.container ) return;
        var field = self._o.trigger, pEl = field,
            width = self.el.offsetWidth, height = self.el.offsetHeight,
            viewportWidth = window.innerWidth || document.documentElement.clientWidth,
            viewportHeight = window.innerHeight || document.documentElement.clientHeight,
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
            left, top, clientRect;

        if ( 'function' === typeof field.getBoundingClientRect )
        {
            clientRect = field.getBoundingClientRect();
            left = clientRect.left + window.pageXOffset;
            top = clientRect.bottom + window.pageYOffset;
        }
        else
        {
            left = pEl.offsetLeft; top  = pEl.offsetTop + pEl.offsetHeight;
            while( (pEl = pEl.offsetParent) )
            {
                left += pEl.offsetLeft;
                top  += pEl.offsetTop;
            }
        }

        // default position is bottom & left
        if ( left + width > viewportWidth ||
            (
                self._o.position.indexOf('right') > -1 &&
                left - width + field.offsetWidth > 0
            )
        )
        {
            left = left - width + field.offsetWidth;
        }
        if ( top + height > viewportHeight + scrollTop ||
            (
                self._o.position.indexOf('top') > -1 &&
                top - height - field.offsetHeight > 0
            )
        )
        {
            top = top - height - field.offsetHeight;
        }
        self.el.style.cssText = [
            'position: absolute',
            'left: ' + left + 'px',
            'top: ' + top + 'px'
        ].join(';');
    },

    /**
     * render HTML for a particular month
     */
    render: function( year, month ) {
        var self = this,
            opts   = self._o,
            only_date = !opts.showTime,
            is_date = isDate( self._d ),
            cur    = is_date ? new Date(self._d.getTime()) : null,
            now    = new Date( ),
            days   = getDaysInMonth(year, month),
            before = new Date(year, month, 1).getDay(),
            data   = [],
            row    = []
        ;
        
        setToStartOfDay( now );
        if ( is_date ) setToStartOfDay( cur );
        
        if ( opts.firstDay > 0 )
        {
            before -= opts.firstDay;
            if ( before < 0 ) before += 7;
        }
        var cells = days + before, after = cells;
        while ( after > 7 ) after -= 7;
        cells += 7 - after;
        for (var i = 0, r = 0; i < cells; i++)
        {
            var day = new Date(year, month, 1 + (i - before)),
                isDisabled = (opts.minDate && day < opts.minDate) || (opts.maxDate && day > opts.maxDate),
                isSelected = is_date ? day.getTime()===cur.getTime() : false,
                isToday = day.getTime()===now.getTime(),
                isEmpty = i < before || i >= (days + before);

            row.push(renderDay(1 + (i - before), month, year, isSelected, isToday, isDisabled, isEmpty));

            if ( ++r === 7 )
            {
                if ( opts.showWeekNumber ) row.unshift(renderWeek(i - before, month, year));
                data.push(renderRow(row, opts.isRTL));
                row = [];
                r = 0;
            }
        }
        return renderTable(opts, data);
    },

    isVisible: function( ) {
        return this._v;
    },

    show: function( ) {
        var self = this;
        if ( !self._v )
        {
            removeClass(self.el, 'is-hidden');
            self._v = true;
            self.draw();
            if ( self._o.bound )
            {
                addEvent(document, 'click', self._onClick);
                self.adjustPosition();
            }
            if ( 'function' === typeof this._o.onOpen ) self._o.onOpen.call(self);
        }
    },

    hide: function( ) {
        var self = this, v = self._v;
        if ( false !== v )
        {
            if ( self._o.bound ) removeEvent(document, 'click', self._onClick);
            self.el.style.cssText = '';
            addClass(self.el, 'is-hidden');
            self._v = false;
            if ( self._t_update )
            {
                self._t_update = false;
                if ( self._o.field )
                {
                    self._o.field.value = self.toString();
                    fireEvent(self._o.field, 'change', { firedBy: self });
                }
                if ( 'function' === typeof self._o.onSelect ) self._o.onSelect.call(self, self.getDate());
            }
            if ( undefined !== v && 'function' === typeof self._o.onClose ) self._o.onClose.call(self);
        }
    },

    /**
     * GAME OVER
     */
    dispose: function( ) {
        var self = this;
        self.hide();
        removeEvent(self.el, 'mousedown', self._onMouseDown, true);
        removeEvent(self.el, 'change', self._onChange);
        if ( self._o.field )
        {
            removeEvent(self._o.field, 'change', self._onInputChange);
            if ( self._o.bound )
            {
                removeEvent(self._o.trigger, 'click', self._onInputClick);
                removeEvent(self._o.trigger, 'focus', self._onInputFocus);
                removeEvent(self._o.trigger, 'blur', self._onInputBlur);
            }
        }
        if ( self.el.parentNode ) self.el.parentNode.removeChild(self.el);
    }
};

return Pikadaytime;
});
