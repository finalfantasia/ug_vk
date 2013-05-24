!function (window) {
  'use strict';

  function getCharCode(ch) {
    return ch.charCodeAt(0);
  }

  function getChar(ascii) {
    return String.fromCharCode(ascii);
  }

  function initialize() {
    // ASCII -> Unicode of Uyghur characters
    KEY_MAP[getCharCode('a')] = 0x06BE;
    KEY_MAP[getCharCode('b')] = 0x0628;
    KEY_MAP[getCharCode('c')] = 0x063A;
    KEY_MAP[getCharCode('D')] = 0x0698;
    KEY_MAP[getCharCode('d')] = 0x062F;
    KEY_MAP[getCharCode('e')] = 0x06D0;
    KEY_MAP[getCharCode('F')] = 0x0641;
    KEY_MAP[getCharCode('f')] = 0x0627;
    KEY_MAP[getCharCode('G')] = 0x06AF;
    KEY_MAP[getCharCode('g')] = 0x06D5;
    KEY_MAP[getCharCode('H')] = 0x062E;
    KEY_MAP[getCharCode('h')] = 0x0649;
    KEY_MAP[getCharCode('i')] = 0x06AD;
    KEY_MAP[getCharCode('J')] = 0x062C;
    KEY_MAP[getCharCode('j')] = 0x0642;
    KEY_MAP[getCharCode('K')] = 0x06C6;
    KEY_MAP[getCharCode('k')] = 0x0643;
    KEY_MAP[getCharCode('l')] = 0x0644;
    KEY_MAP[getCharCode('m')] = 0x0645;
    KEY_MAP[getCharCode('n')] = 0x0646;
    KEY_MAP[getCharCode('o')] = 0x0648;
    KEY_MAP[getCharCode('p')] = 0x067E;
    KEY_MAP[getCharCode('q')] = 0x0686;
    KEY_MAP[getCharCode('r')] = 0x0631;
    KEY_MAP[getCharCode('s')] = 0x0633;
    KEY_MAP[getCharCode('t')] = 0x062A;
    KEY_MAP[getCharCode('u')] = 0x06C7;
    KEY_MAP[getCharCode('v')] = 0x06C8;
    KEY_MAP[getCharCode('w')] = 0x06CB;
    KEY_MAP[getCharCode('x')] = 0x0634;
    KEY_MAP[getCharCode('y')] = 0x064A;
    KEY_MAP[getCharCode('z')] = 0x0632;
    KEY_MAP[getCharCode('/')] = 0x0626;

    // Uyghur punctuation marks
    KEY_MAP[getCharCode(';')] = 0x061B;
    KEY_MAP[getCharCode('?')] = 0x061F;
    KEY_MAP[getCharCode(',')] = 0x060C;

    // Invert parentheses, brackets, and braces for RTL layout.
    KEY_MAP[getCharCode('(')] = getCharCode(')');
    KEY_MAP[getCharCode(')')] = getCharCode('(');
    KEY_MAP[getCharCode('[')] = getCharCode(']');
    KEY_MAP[getCharCode(']')] = getCharCode('[');
    KEY_MAP[getCharCode('}')] = 0x00AB;
    KEY_MAP[getCharCode('{')] = 0x00BB;
    KEY_MAP[getCharCode('<')] = getCharCode('>'); // Sticking to the standard. 
    KEY_MAP[getCharCode('>')] = getCharCode('<'); // Sticking to the standard.

    CTRL_KEY_LISTENERS.K = toggleInputMode;
    // [Ctrl-T] can no longer be used for inverting the input direction in WebKit (Blink), see:
    //   https://code.google.com/p/chromium/issues/detail?id=33056
    // Therefore, use 'Y' ('Y' as in the Uyghur word 'Yönilish') 
    CTRL_KEY_LISTENERS.Y = toggleInputDirection;
  }

  function toggleInputMode() {
    inputMode = 1 - inputMode;
  }

  function toggleInputDirection(event) {
    var target = event.srcElement || event.target;

    target.style.direction = (target.style.direction === 'ltr' ? 'rtl' : 'ltr');
  }

  function insert(element, text) {
    var previousSelectionStart;
    var currentSelectionStart;
    var previousScrollTop;
    var previousScrollLeft;

    if (document.selection && document.selection.createRange) { // Trident 5.0+
      document.selection.createRange().text = text;
    } else { // W3C 
      previousSelectionStart = element.selectionStart;

      // Gecko scrolls to top in textarea after input, fix this.
      if (element.type === 'textarea' && element.scrollTop) {
        previousScrollTop = element.scrollTop;
        previousScrollLeft = element.scrollLeft;
      }

      element.value = element.value.substring(0, element.selectionStart) +
        text + element.value.substring(element.selectionEnd);

      if (previousScrollTop) {
        element.scrollTop = previousScrollTop;
        element.scrollLeft = previousScrollLeft;
      }

      currentSelectionStart = previousSelectionStart + text.length;
      element.setSelectionRange(currentSelectionStart, currentSelectionStart);
    }
  }

  function keydownListener(e) {
    var event = e || window.event;
    var isMetaKey = event.ctrlKey || event.metaKey;
    var keyCode = event.keyCode || event.which;
    var c = getChar(keyCode).toUpperCase();

    if (isMetaKey && CTRL_KEY_LISTENERS[c]) {
      CTRL_KEY_LISTENERS[c](event);

      if (event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.returnValue = false;
        event.cancelBubble = true;
      }
    }
  }

  function keypressListener(e) {
    var event = e || window.event;
    var target = event.srcElement || event.target;
    var isMetaKey = event.ctrlKey || event.metaKey;
    var keyCode = event.keyCode || event.which;
    var c = getChar(keyCode).toUpperCase();
    var isAlphabetic = /^[A-Z]{1}$/.test(c);
    var preventDefaultAndStopPropagation = false;

    // The extra check for the meta key ([Ctrl]) is because:
    //   https://bugzilla.mozilla.org/show_bug.cgi?id=501496 
    if (!isMetaKey && inputMode === 0) {
      if (KEY_MAP[keyCode]) {
        if (event.keyCode && !event.which) { // Trident 4.0-
          event.keyCode = KEY_MAP[keyCode];
        } else {                             // W3C event is read-only.
          insert(target, getChar(KEY_MAP[keyCode]));
        }
        preventDefaultAndStopPropagation = true;
      } else if (isAlphabetic) {
        event.returnValue = false;
        preventDefaultAndStopPropagation = true;
      } 
    }

    if (preventDefaultAndStopPropagation) {
      if (event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    }
  }

  function indexOf(array, element) {
    var i;

    if (array && array.length) {
      for (i = 0; i < array.length; i++) {
        if (array[i] === element) {
          return i;
        }
      }
    }

    return -1;
  }

  function getAllEditBoxes() {
    var inputs;
    var textAreas;
    var all = [];
    var i;

    inputs = document.getElementsByTagName('input');
    textAreas = document.getElementsByTagName('textarea');

    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].type.toLowerCase() === 'text') {
        all.push(inputs[i]);
      }
    }

    for (i = 0; i < textAreas.length; i++) {
      all.push(textAreas[i]); 
    }

    return all;
  }

  function addEventListener(element, event, listener) {
    if (element.addEventListener) { // W3C
      element.removeEventListener(event, listener, false);
      element.addEventListener(event, listener, false);
    } else if (element.attachEvent) { // Trident 4.0-
      element.detachEvent('on' + event, listener);
      element.attachEvent('on' + event, listener);
    }
  }

  function addEventListeners() {
    var all;
    var cancel = true;
    var i;

    if (!addToAll) {
      if (whitelist.length) {
        cancel = false;
        whitelist = whitelist.split(LIST_ELEMENT_DELIMITER);
      }

      if (blacklist.length) {
        cancel = false;
        addToAll = true; // A blacklist by itself implies 'addToAll'.
        blacklist = blacklist.split(LIST_ELEMENT_DELIMITER);
      }
    } else {
      if (blacklist.length) {
        cancel = false;
        blacklist = blacklist.split(LIST_ELEMENT_DELIMITER);
      }
    }

    if (cancel) {
      return;
    }

    all = getAllEditBoxes();

    if (addToAll) {
      for (i = 0; i < all.length; i++) {
        if (indexOf(blacklist, all[i].name) < 0) {
          addEventListener(all[i], 'keydown', keydownListener);
          addEventListener(all[i], 'keypress', keypressListener);
        }
      }
    } else {
      for (i = 0; i < all.length; i++) {
        if (indexOf(whitelist, all[i].name) >= 0) {
          addEventListener(all[i], 'keydown', keydownListener);
          addEventListener(all[i], 'keypress', keypressListener);
        }
      }
    }
  }

  function load() {
    console.log('Loading ug_vkl...');
    initialize();
    addEventListeners();
    loaded = true;
  }

  function onDomReady() {
    function callDomReadyCallback() {
      if (!isDomReadyCallbackCalled) {
        if (!document.body) { // In case IE gets a little overzealous.
          return setTimeout(callDomReadyCallback, 1);
        }

        isDomReadyCallbackCalled = true;
        load();
      }
    }

    function domReadyListener() {
      if (document.addEventListener) {
        document.removeEventListener('DOMContentLoaded', domReadyListener);
      } else if (document.attachEvent) {
        // Execution gets here only when document.readyState !== 'loading'
        document.detachEvent('onreadystatechange', domReadyListener);
      } else {
        return;
      }

      callDomReadyCallback();
    }

    function ieScrollCheck() {
      if (isDomReadyCallbackCalled) {
        return;
      }

      try {
        document.documentElement.doScroll('left');
      } catch (e) {
        setTimeout(ieScrollCheck, 1);
        return;
      }

      callDomReadyCallback();
    }

    function addDomReadyListener() {
      var isTopLevel = false;

      if (isDomReadyListenerAdded) {
        return;
      }
      isDomReadyListenerAdded = true;

      // In case DOM has already been loaded, call the function right away.
      if (document.readyState !== 'loading') {
        callDomReadyCallback();
        return;
      }

      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', domReadyListener, false);
        window.addEventListener('load', domReadyListener, false); // Fallback. 
      } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', domReadyListener);
        document.attachEvent('onload', domReadyListener); // Fallback.

        // http://javascript.nwbox.com/IEContentLoaded/
        try {
          isTopLevel = !window.frameElement;
        } catch (e) {}

        if (document.documentElement.doScroll && isTopLevel) {
          ieScrollCheck();
        }
      }
    }

    var isDomReadyCallbackCalled = false;
    var isDomReadyListenerAdded = false;

    addDomReadyListener();
  }

  var KEY_MAP = {};
  var CTRL_KEY_LISTENERS = {}; 
  var LIST_ELEMENT_DELIMITER = ':';

  var document = window.document;
  var addToAll = window.attachAll || false; 
  var whitelist = window.bedit_allow || [];
  var blacklist = window.bedit_deny || [];
  var inputMode = 0; // 0: Uyghur, 1: Latin

  // Using DOM Level 0 event model is discouraged.
  // window.addchar = function (notUsed, event) { keypressListener(event); };
  // window.proc_kd = keydownListener;

  onDomReady();
} (window);

