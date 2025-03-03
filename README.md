Pikadaytime
===========

### A refreshing JavaScript Datetimepicker

* Lightweight (less than 5kb minified and gzipped)
* No dependencies <del>(but plays well with [Moment.js][moment])</del>
* Date `encoder` / `decoder` are available as options to be overwritten (more modular, not necesarily by `moment.js`)
* Modular CSS classes for easy styling

![Pikadaytime](/pikadaytime.png)


**see also:**

* [ModelView](https://github.com/foo123/modelview.js) a simple, fast, powerful and flexible MVVM framework for JavaScript
* [Contemplate](https://github.com/foo123/Contemplate) a fast and versatile isomorphic template engine for PHP, JavaScript, Python
* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets, made as simple as possible, both client and server, both desktop and mobile, can be used as (template) plugins and/or standalone for PHP, JavaScript, Python (can be used as [plugins for Contemplate](https://github.com/foo123/Contemplate/blob/master/src/js/plugins/plugins.txt))
* [Paginator](https://github.com/foo123/Paginator)  simple and flexible pagination controls generator for PHP, JavaScript, Python
* [ColorPicker](https://github.com/foo123/ColorPicker) a fully-featured and versatile color picker widget
* [Pikadaytime](https://github.com/foo123/Pikadaytime) a refreshing JavaScript Datetimepicker that is ightweight, with no dependencies
* [Timer](https://github.com/foo123/Timer) count down/count up JavaScript widget
* [InfoPopup](https://github.com/foo123/InfoPopup) a simple JavaScript class to show info popups easily for various items and events (Desktop and Mobile)
* [Popr2](https://github.com/foo123/Popr2) a small and simple popup menu library
* [area-select.js](https://github.com/foo123/area-select.js) a simple JavaScript class to select rectangular regions in DOM elements (image, canvas, video, etc..)
* [area-sortable.js](https://github.com/foo123/area-sortable.js) simple and light-weight JavaScript class for handling smooth drag-and-drop sortable items of an area (Desktop and Mobile)
* [css-color](https://github.com/foo123/css-color) simple class for manipulating color values and color formats for css, svg, canvas/image
* [jquery-plugins](https://github.com/foo123/jquery-plugins) a collection of custom jQuery plugins
* [jquery-ui-widgets](https://github.com/foo123/jquery-ui-widgets) a collection of custom, simple, useful jQueryUI Widgets
* [touchTouch](https://github.com/foo123/touchTouch) a variation of touchTouch jQuery Optimized Mobile Gallery in pure vanilla JavaScript
* [Imagik](https://github.com/foo123/Imagik) fully-featured, fully-customisable and extendable Responsive CSS3 Slideshow
* [Carousel3](https://github.com/foo123/Carousel3) HTML5 Photo Carousel using Three.js
* [Rubik3](https://github.com/foo123/Rubik3) intuitive 3D Rubik Cube with Three.js
* [MOD3](https://github.com/foo123/MOD3) JavaScript port of AS3DMod ActionScript 3D Modifier Library
* [RT](https://github.com/foo123/RT) unified client-side real-time communication for JavaScript using XHR polling / BOSH / WebSockets / WebRTC
* [AjaxListener.js](https://github.com/foo123/AjaxListener.js): Listen to any AJAX event on page with JavaScript, even by other scripts
* [asynchronous.js](https://github.com/foo123/asynchronous.js) simple manager for asynchronous, linear, parallel, sequential and interleaved tasks for JavaScript
* [classy.js](https://github.com/foo123/classy.js) Object-Oriented mini-framework for JavaScript



**Production ready?** Since version 1.0.0 Pikaday is stable and used in production. If you do however find bugs or have feature requests please submit them to the [GitHub issue tracker][issues].  
Also see the [changelog](CHANGELOG.md)


## Usage

**Pikaday** can be bound to an input field:

```html
<input type="text" id="datepicker">
```

Add the JavaScript to the end of your document:

```html
<script src="pikaday.js"></script>
<script>
    var picker = new Pikaday({ field: document.getElementById('datepicker') });
</script>
```

If you're using **jQuery** make sure to pass only the first element:

```javascript
var picker = new Pikaday({ field: $('#datepicker')[0] });
```

If the Pikaday instance is not bound to a field you can append the element anywhere:

```javascript
var field = document.getElementById('datepicker');
var picker = new Pikaday({
    onSelect: function(date) {
        field.value = picker.toString();
    }
});
field.parentNode.insertBefore(picker.el, field.nextSibling);
```

For advanced formatting load [Moment.js][moment] prior to Pikaday:  
See the [moment.js example][] for a full version.

```html
<input type="text" id="datepicker" value="9 Oct 2014">

<script src="moment.js"></script>
<script src="pikaday.js"></script>
<script>
    var picker = new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'D MMM YYYY',
        onSelect: function() {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
    });
</script>
```

### Configuration

As the examples demonstrate above
Pikaday has many useful options:

* `field` bind the datepicker to a form field
* `trigger` use a different element to trigger opening the datepicker, see [trigger example][] (default to `field`)
* `bound` automatically show/hide the datepicker on `field` focus (default `true` if `field` is set)
* `position` preferred position of the datepicker relative to the form field, e.g.: `top right`, `bottom right` **Note:** automatic adjustment may occur to avoid datepicker from being displayed outside the viewport, see [positions example][] (default to 'bottom left')
* `reposition` can be set to false to not reposition datepicker within the viewport, forcing it to take the configured `position` (default: true)
* `container` DOM node to render calendar into, see [container example][] (default: undefined) 
* `format` the default output format for `.toString()` and `field` value (requires [Moment.js][moment] for custom formatting)
* `formatStrict` the default flag for moment's strict date parsing (requires [Moment.js][moment] for custom formatting)
* `defaultDate` the initial date to view when first opened
* `setDefaultDate` make the `defaultDate` the initial selected value
* `firstDay` first day of the week (0: Sunday, 1: Monday, etc)
* `minDate` the minimum/earliest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `maxDate` the maximum/latest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `disableWeekends` disallow selection of Saturdays or Sundays
* `disableDayFn` callback function that gets passed a Date object for each day in view. Should return true to disable selection of that day.
* `yearRange` number of years either side (e.g. `10`) or array of upper/lower range (e.g. `[1900,2015]`)
* `showWeekNumber` show the ISO week number at the head of the row (default `false`)
* `isRTL` reverse the calendar for right-to-left languages
* `i18n` language defaults for month and weekday names (see internationalization below)
* `yearSuffix` additional text to append to the year in the title
* `showMonthAfterYear` render the month after year in the title (default `false`)
* `showDaysInNextAndPreviousMonths` render days of the calendar grid that fall in the next or previous months to the current month instead of rendering an empty table cell (default: false)
* `numberOfMonths` number of visible calendars
* `mainCalendar` when `numberOfMonths` is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`). Only used for the first display or when a selected date is not already visible
* `theme` define a classname that can be used as a hook for styling different themes, see [theme example][] (default `null`)
* `onSelect` callback function for when a date is selected
* `onOpen` callback function for when the picker becomes visible
* `onClose` callback function for when the picker is hidden
* `onDraw` callback function for when the picker draws a new month

## jQuery Plugin

The normal version of Pikaday does not require jQuery, however there is a jQuery plugin if that floats your boat (see `plugins/pikaday.jquery.js` in the repository). This version requires jQuery, naturally, and can be used like other plugins:  
See the [jQuery example][] for a full version.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="pikaday.js"></script>
<script src="plugins/pikaday.jquery.js"></script>
<script>

// activate datepickers for all elements with a class of `datepicker`
$('.datepicker').pikaday({ firstDay: 1 });

// chain a few methods for the first datepicker, jQuery style!
$('.datepicker').eq(0).pikaday('show').pikaday('gotoYear', 2042);

</script>
```

## AMD support

If you use a modular script loader than Pikaday is not bound to the global object and will fit nicely in your build process. You can require Pikaday just like any other module.  
See the [AMD example][] for a full version.

```javascript
require(['pikaday'], function(Pikaday) {
    var picker = new Pikaday({ field: document.getElementById('datepicker') });
});
```
The same applies for the jQuery plugin mentioned above.  
See the [jQuery AMD example][] for a full version.

```javascript
require(['jquery', 'pikaday.jquery'], function($) {
    $('#datepicker').pikaday();
});
```

## CommonJS module support

If you use a CommonJS compatible environment you can use the require function to import Pikaday.


```javascript
var pikaday = require('pikaday');
```

When you bundle all your required modules with [Browserify][browserify] and you don't use [Moment.js][moment] specify the ignore option:

`browserify main.js -o bundle.js -i moment`

## Ruby on Rails

If you're using **Ruby on Rails**, make sure to check out the [Pikaday gem][gem].

## Methods

You can control the date picker after creation:

```javascript
var picker = new Pikaday({ field: document.getElementById('datepicker') });
```

### Get and set date

`picker.toString('YYYY-MM-DD')`

Returns the selected date in a string format. If [Moment.js][moment] exists (recommended) then Pikaday can return any format that Moment understands, otherwise you're stuck with JavaScript's default.

`picker.getDate()`

Returns a basic JavaScript `Date` object of the selected day, or `null` if no selection.

`picker.setDate('2015-01-01')`

Set the current selection. This will be restricted within the bounds of `minDate` and `maxDate` options if they're specified. You can optionally pass a boolean as the second parameter to prevent triggering of the onSelect callback (true), allowing the date to be set silently.

`picker.getMoment()`

Returns a [Moment.js][moment] object for the selected date (Moment must be loaded before Pikaday).

`picker.setMoment(moment('14th February 2014', 'DDo MMMM YYYY'))`

Set the current selection with a [Moment.js][moment] object (see `setDate` for details).

### Change current view

`picker.gotoDate(new Date(2014, 1))`

Change the current view to see a specific date. This example will jump to February 2014 ([month is a zero-based index][mdn_date]).

`picker.gotoToday()`

Shortcut for `picker.gotoDate(new Date())`

`picker.gotoMonth(2)`

Change the current view by month (0: January, 1: Februrary, etc).

`picker.nextMonth()`
`picker.prevMonth()`

Go to the next or previous month (this will change year if necessary).

`picker.gotoYear()`

Change the year being viewed.

`picker.setMinDate()`

Update the minimum/earliest date that can be selected.

`picker.setMaxDate()`

Update the maximum/latest date that can be selected.

`picker.setStartRange()`

Update the range start date. For using two Pikaday instances to select a date range.

`picker.setEndRange()`

Update the range end date. For using two Pikaday instances to select a date range.

### Show and hide datepicker

`picker.isVisible()`

Returns `true` or `false`.

`picker.show()`

Make the picker visible.

`picker.adjustPosition()`

Recalculate and change the position of the picker.

`picker.hide()`

Hide the picker making it invisible.

`picker.destroy()`

Hide the picker and remove all event listeners — no going back!

### Internationalization

The default `i18n` configuration format looks like this:

```javascript
i18n: {
    previousMonth : 'Previous Month',
    nextMonth     : 'Next Month',
    months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
}
```

You must provide 12 months and 7 weekdays (with abbreviations). Always specify weekdays in this order with Sunday first. You can change the `firstDay` option to reorder if necessary (0: Sunday, 1: Monday, etc). You can also set `isRTL` to `true` for languages that are read right-to-left.


## Browser Compatibility

* IE 7+
* Chrome 8+
* Firefox 3.5+
* Safari 3+
* Opera 10.6+

[![browser compatibility](https://ci.testling.com/rikkert/pikaday.png)
](https://ci.testling.com/rikkert/pikaday)


* * *

## Authors

* David Bushell [http://dbushell.com][Bushell] [@dbushell][Bushell Twitter]
* Ramiro Rikkert [GitHub][Rikkert] [@RamRik][Rikkert Twitter]

Thanks to [@shoogledesigns][shoogledesigns] for the name.

Copyright © 2014 David Bushell | BSD & MIT license

  [Pikaday]:     http://dbushell.github.com/Pikaday/                              "Pikaday"
  [moment]:      http://momentjs.com/                                             "moment.js"
  [browserify]:  http://browserify.org/                                           "browserify"
  [screenshot]:  https://raw.github.com/dbushell/Pikaday/gh-pages/screenshot.png  "Screenshot"
  [issues]:      https://github.com/dbushell/Pikaday/issues                       "Issue tracker"
  [gem]:         https://rubygems.org/gems/pikaday-gem                            "RoR gem"
  [mdn_date]:    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date  "Date"
  [Bushell]:     http://dbushell.com/                                             "dbushell.com"
  [Bushell Twitter]: https://twitter.com/dbushell                                 "@dbushell"
  [Rikkert]:     https://github.com/rikkert                                       "Rikkert GitHub"
  [Rikkert Twitter]: https://twitter.com/ramrik                                   "@ramrik"
  [shoogledesigns]:  https://twitter.com/shoogledesigns/status/255209384261586944 "@shoogledesigns"
  [issue1]:      https://github.com/dbushell/Pikaday/issues/1                     "Issue 1"
  [issue18]:     https://github.com/dbushell/Pikaday/issues/18                    "Issue 18"
  [stas]:        https://github.com/stas                                          "@stas"
  [stas Pika]:   https://github.com/stas/Pikaday                                  "Pikaday"
  [owenmead]:    https://github.com/owenmead                                      "@owenmead"
  [owen Pika]:   https://github.com/owenmead/Pikaday                              "Pikaday"
  [xeeali]:      https://github.com/xeeali                                        "@xeeali"
  [xeeali Pika]: https://github.com/xeeali/Pikaday                                "Pikaday"
  [moment.js example]: http://dbushell.github.com/Pikaday/examples/moment.html    "Pikaday w/ moment.js"
  [jQuery example]: http://dbushell.github.com/Pikaday/examples/jquery.html       "Pikaday w/ jQuery"
  [AMD example]: http://dbushell.github.com/Pikaday/examples/amd.html             "Pikaday w/ AMD"
  [jQuery AMD example]: http://dbushell.github.com/Pikaday/examples/jquery-amd.html "Pikaday w/ jQuery + AMD"
  [trigger example]: http://dbushell.github.com/Pikaday/examples/trigger.html     "Pikaday using custom trigger"
  [positions example]: http://dbushell.github.com/Pikaday/examples/positions.html "Pikaday using different position options"
  [container example]: http://dbushell.github.com/Pikaday/examples/container.html "Pikaday using custom calendar container"
  [theme example]: http://dbushell.github.com/Pikaday/examples/theme.html         "Pikaday using multiple themes"
