ug_vkl
======

A virtual keyboard layout for the Uyghur language written in JavaScript. This is an optimized and modernized fork of the original version ([bedit.js](http://www.yulghun.com/news/vkb.html)) written by Mr. Muhemmed Abdullah.

## What's New 

This fork fixes a few issues that exist in the original version:

* Allows using Ctrl-Y, instead of Ctrl-T as it no longer works in Google Chrome 4+, to toggle typing direction;
* Implements the right way of loading the script for IE 8- when DOM is ready;
* Makes the virtual keyboard layout standard-compliant; 
* Removes the code for conversion between UEY and ULY;
* Removes the code for conversion between the obsolete Alkatip encoding and Unicode;
* Removes most of the global variables (including `window.addchar` and `window.proc_kd`, but keeps `bedit_allow`, `bedit_deny`, and `attachAll` for backward-compatibility) by enclosing the the whole code in a function scope;
* Removes the workaround to fix keyboard event issues with older versions of Opera;
* Now each input element maintains its own input mode independently of other elements;
* Code clean-ups.

## Usage

Put a global script block at the bottom of your page right before `</body>` to specify the elements to which you want to add the virtual keyboard layout support, e.g.:
```
<html>
...
<body>
...
<script type="text/javascript">
  // Add the virtual keyboard layout support to all the text input and textarea elements.
  // Note that this is optional if you defined bedit_deny.
  attachAll = true;

  // Blacklist the specified elements so that they won't be added the virtual keyboard layout support.
  bedit_deny = "password:url:email";
 
  // You may use this option mutually exclusively with the options above
  // to explicitly specify only those elements which will be added the virtual keyboard layout support.
  // bedit_allow = "name:comment:post"; 
</script>
</body>
</html>
```

Put ug_vkl.js between the global script block above and `</body>`, e.g.:
```
<html>
...
<body>
...
<script type="text/javascript">
  bedit_deny = "password:url:email";
</script>
<script src="http://www.yourwebsite.com/js/ug_vkl.js" type="text/javascript"></script>
</body>
</html>
```

Alternatively, you may put the global variable definitions inside ug_vkl.js if you so choose, although not recommeded, e.g.:
```
bedit_deny = "password:url:email";

!function (window) {
  'use strict';
...
```

