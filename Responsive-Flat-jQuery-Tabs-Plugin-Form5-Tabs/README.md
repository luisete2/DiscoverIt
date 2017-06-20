form5-tabs
==========

form5-tabs is a simple but powerful jQuery plugin to render tabs from custom
html elements. Only **3KB** of minified Javascript, along with
your own styles (very basic demo styles are provided).

[Demo](http://form5.github.io/form5-tabs/)

## Getting started

### How to fetch form5-tabs?

Install with [Bower](http://bower.io): `bower install form5-tabs`

Clone the Github project: `git clone https://github.com/Form5/form5-tabs.git`

Or [download zip](https://github.com/Form5/form5-tabs/archive/master.zip).

### Then what?

After installation simply load the files along with other styles and scripts.
Remember that this script requires jQuery, meaning jQuery should already be
loaded before this script. We recommend using the latest stable release.

```html
<link rel="stylesheet" href="path/to/form5-tabs.css">
...
<script src="path/to/jquery.js"></script>
<script src="path/to/form5-tabs.min.js"></script>
<script>
  $(function(){
    $('tabs').tabs();
  });
</script>
```

Construct your content as demonstrated below. In case of disabled javascript,
the `.heading` element is displayed, otherwise it is removed and used for the
'tab' navigation (check out our [demo](http://form5.github.io/form5-tabs/)).
The selector for the heading element can be configured easily.

```html
<tabs>
  <tab>
    <h1 class="heading">First tab heading</h1>
    ...
  </tab>
  <tab>
    <h1 class="heading">Second tab heading</h1>
    ...
  </tab>
</tabs>
```

## Advanced usage

There are a few ways to configure the scripts functionality. Here you can see
all the options with their default values, and below you can find more
detailed description for each option.

```javascript
$('tabs').tabs({
  heading: '>.heading',
  responsive: true,
  start: 0,
  toggle: function() {},
  init: function() {},
  debug: false
});
```

`heading: string (selector)` **Default: '>.heading'**

Which element within `tabs > tab` should be used as the heading/name of said tab. Note that this element will be removed from the DOM, it only exists as a fallback mechanism in case of disabled JS support.

`responsive: boolean` **Default: true**

All responsive awesomeness should be handled by your css, but to help you along the script can add a `[break='true']` attribute to the parent when the total width of tabs exceeds the windows width. Then you can do whatever your heart desires!

`start: integer` **Default: 0**

Which tab should be visible on load, 0 meaning the first tab, 1 the second etc.

`toggle: function (tab)` **Default: function() {}**

Optional function to be ran at each tab toggle. Each time a new tab is displayed, this baby will run like Forrest! Will return the newly active tab.

`init: function` **Default: function() {}**

Optional function to be ran at initialization.

`debug: boolean` **Default: false**

If you are having problems and are not sure certain parts of the scripts are actually working, you can enable this option to receive console.logs with messages for initialization, activating new tabs and destroying.

### After initialization

For js vs no-js styling, an `[alive='true']` attribute is included after initialization. See demo styles for an idea of usage.

To navigate between tabs outside of the default navigation, you can simply call the function again with an integer instead of options, as demonstrated below.

```javascript
$('tabs').tabs(1);
```

Sometimes we do things we wish we hadn't, and just wanna take a step back and rethink the situation. For those instances, we included a helper string that enables you to simply reverse all changes made by this script.

```javascript
$('tabs').tabs('destroy');
```

After running this, you can initialize some fresh tabs with new options or whatever your mind can imagine.

### Still not satisfied?

You could go all in and customize the script directly. The original can be found in `src/form5-tabs.js`. To compile a minified/uglified version of your new script you can build it again by running:

```shell
$ npm install
$ grunt build
```

If you would like to extend the core functionality of this script in a way that could benefit others, don't hesitate to create a pull request!

## Cress

### Using [Cress](http://github.com/Form5/Cress)

If you are using our awesome CSS framework Cress, you can find a `.scss` file using the appropriate variables in `src/form5-tabs.cress.scss`. That way you have some basic tabs working directly with your current styles.

## Author
Written by [Benedikt D Valdez](http://github.com/benediktvaldez), developer at
[Form5](http://www.form5.is).
