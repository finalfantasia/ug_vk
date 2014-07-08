// ug_vk.js (https://github.com/finalfantasia/ug_vk)
// The MIT License (MIT)
// Copyright (c) 2013, 2014 Abdussalam Abdurrahman (abdusalam.abdurahman@gmail.com)
(function (window) {
    'use strict';

    function isFunction(object) {
        return (typeof object === 'function');
    }

    function isArray(object) {
        return (Object.prototype.toString.call(object) === '[object Array]');
    }

    function indexOf(array, element) {
        var i;

        for (i = 0; i < array.length; i++) {
            if (array[i] === element) {
                return i;
            }
        }

        return -1;
    }

    function findAllTextInputs() {
        var inputs,
            textAreas,
            all = [],
            i;

        inputs = document.getElementsByTagName('input');
        textAreas = document.getElementsByTagName('textarea');

        for (i = 0; i < inputs.length; i++) {
            if (indexOf(['text', 'search'], inputs[i].type.toLowerCase()) >= 0) {
                all.push(inputs[i]);
            }
        }

        for (i = 0; i < textAreas.length; i++) {
            all.push(textAreas[i]);
        }

        return all;
    }

    function addEventListener(target, event, listener) {
        if ('addEventListener' in target) {
            target.removeEventListener(event, listener, false);
            target.addEventListener(event, listener, false);
        } else {
            target.detachEvent('on' + event, listener);
            target.attachEvent('on' + event, listener);
        }
    }

    function removeEventListener(target, event, listener) {
        if ('removeEventListener' in target) {
            target.removeEventListener(event, listener, false);
        } else {
            target.detachEvent('on' + event, listener);
        }
    }

    function addEventListeners() {
        var all, target, i;

        all = findAllTextInputs();

        if (options.all) {
            for (i = 0; i < all.length; i++) {
                target = all[i];

                if (indexOf(options.blacklist, target.name) < 0) {
                    addEventListener(target, 'keydown', keydownListener);
                    addEventListener(target, 'keypress', keypressListener);
                    addSwipeListeners(target, switchKeyboardMode);

                    keyboardMode[target.name] = 'ug';
                }
            }
        } else {
            for (i = 0; i < all.length; i++) {
                target = all[i];

                if (indexOf(options.whitelist, target.name) >= 0) {
                    addEventListener(target, 'keydown', keydownListener);
                    addEventListener(target, 'keypress', keypressListener);
                    addSwipeListeners(target, switchKeyboardMode);

                    keyboardMode[target.name] = 'ug';
                }
            }
        }
    }

    function removeEventListeners() {
        var all, target, i;

        all = findAllTextInputs();

        for (i = 0; i < all.length; i++) {
            target = all[i];

            removeEventListener(target, 'keydown', keydownListener);
            removeEventListener(target, 'keypress', keypressListener);
        }
    }

    function addSwipeListeners(target, listener) {
        var startX, startY, dx, direction,
            X_THRESHOLD = 50,
            Y_THRESHOLD = 15;

        function cancelTouch() {
            removeEventListener(target, 'touchmove', touchMoveListener);
            removeEventListener(target, 'touchend', touchEndListener);

            startX = null;
            startY = null;
            dx = null;
            direction = null;
        }

        function touchMoveListener(event) {
            var dy;

            if (event.touches.length > 1) {
                cancelTouch();
            } else {
                dx = event.touches[0].pageX - startX;
                dy = event.touches[0].pageY - startY;

                if ((direction && (direction < 0 && dx > 0) || (direction > 0 && dx < 0)) ||
                    Math.abs(dy) > Y_THRESHOLD) {
                    cancelTouch();
                } else {
                    direction = dx;
                    event.preventDefault();
                }
            }
        }

        function touchEndListener() {
            var distance = Math.abs(dx);

            cancelTouch();

            if (distance > X_THRESHOLD) {
                listener(target);
            }
        }

        function touchStartListener(event) {
            if (event.touches.length === 1) {
                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY;

                addEventListener(target, 'touchmove', touchMoveListener);
                addEventListener(target, 'touchend', touchEndListener);
            }
        }

        addEventListener(target, 'touchstart', touchStartListener);
    }

    function keydownListener(event) {
        var target = event.target || event.srcElement,
            keyCode = 'which' in event ? event.which : event.keyCode,
            c = String.fromCharCode(keyCode).toUpperCase(),
            // [Ctrl] on PC === [Command] on Mac;
            ctrlKey = event.ctrlKey || // [Ctrl] on PC
                      event.metaKey;   // [Command] on Mac

        if (ctrlKey && c in CTRL_KEY_LISTENERS) {
            CTRL_KEY_LISTENERS[c](target);

            if ('preventDefault' in event) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.returnValue = false;
                event.cancelBubble = true;
            }
        }
    }

    function keypressListener(event) {
        function getCharPrecedingInsertion(target) {
            var precedingChar;

            if (target.selectionStart === 0) { // caret is at the begginning of the input area.
                precedingChar = null;
            } else {
                precedingChar = target.value[target.selectionStart - 1];
            }

            return precedingChar;
        }

        var target = 'target' in event ? event.target : event.srcElement,
            keyCode = 'which' in event ? event.which : event.keyCode,
            c = String.fromCharCode(keyCode),
            isAlphabetic = /^[A-Za-z]{1}$/.test(c),
            // [Ctrl] on PC === [Command] on Mac;
            ctrlKey = event.ctrlKey || // [Ctrl] on PC
                      event.metaKey,   // [Command] on Mac
            ugChar,
            isEventHandled;

        // The extra check for [Ctrl] is because:
        //   https://bugzilla.mozilla.org/show_bug.cgi?id=501496
        if (!ctrlKey && keyboardMode[target.name] === 'ug') {
            if ('keyCode' in event && !('which' in event)) { // Trident 4.0-
                ugChar = UgKeyCharMap.getUgChar(c);

                if (ugChar) {
                    event.keyCode = ugChar.charCodeAt(0);
                    isEventHandled = true;
                } else {
                    isEventHandled = false;
                }
            } else { // modern browsers
                ugChar = UgKeyCharMap.getUgChar(c, options.smartHamza, getCharPrecedingInsertion(target));

                if (ugChar) {
                    insert(target, ugChar);
                    isEventHandled = true;
                } else {
                    isEventHandled = false;
                }
            }

            if (!isEventHandled && isAlphabetic) {
                // ignore any unmapped English letter (mostly capitals) in the Uyghur input mode.
                event.returnValue = false;
                isEventHandled = true;
            }
        }

        if (isEventHandled) {
            if ('preventDefault' in event) {
                event.preventDefault();
                event.stopPropagation();

                // manually fire the 'input' event to notify its listeners that
                // the value of the target has changed.
                target.dispatchEvent(new window.Event('input', {bubbles: true}));
            } else {
                event.cancelBubble = true;
            }
        }
    }

    function switchKeyboardMode(target) {
        var i;

        keyboardMode[target.name] = (keyboardMode[target.name] === 'ug' ? 'en' : 'ug');

        for (i = 0; i < keyboardModeChangeListeners.length; i++) {
            keyboardModeChangeListeners[i]({
                target: target,
                keyboardMode: keyboardMode[target.name]
            });
        }
    }

    function switchWritingDirection(target) {
        target.dir = (target.dir === 'ltr' ? 'rtl' : 'ltr');
    }

    function insert(target, ch) {
        var currentSelectionStart,
            newSelectionStart;

        if ('selection' in document && 'createRange' in document.selection) { // Trident 6.0-
            document.selection.createRange().text = ch;
        } else {
            // setting the value of the target changes selectionStart so keep a copy of
            // the offset where the caret was before insertion.
            currentSelectionStart = target.selectionStart;

            // insert.
            target.value = target.value.slice(0, target.selectionStart) + ch +
                target.value.slice(target.selectionEnd);

            // adjust the caret position.
            newSelectionStart = currentSelectionStart + ch.length;
            target.setSelectionRange(newSelectionStart, newSelectionStart);
        }
    }

    function preprocessBeditJSOptions() {
        var opts = {};

        opts.all = !!window.attachAll;

        if (opts.all) {
            if ((typeof window.bedit_deny === 'string') && window.bedit_deny.length > 0) {
                opts.blacklist = window.bedit_deny.split(':');
            } else {
                opts.blacklist = [];
            }
        } else {
            if ((typeof window.bedit_allow === 'string') && window.bedit_allow.length > 0) {
                opts.whitelist = window.bedit_allow.split(':');
            } else {
                opts.whitelist = [];
            }
        }

        return opts;
    }

    function checkOptions(opts) {
        var proceed;

        // smartHamza is enabled by default.
        opts.smartHamza = !('smartHamza' in opts) || !!opts.smartHamza;

        opts.all = !!opts.all;

        if (opts.all) {
            if ('blacklist' in opts) {
                proceed = isArray(opts.blacklist);
            } else {
                opts.blacklist = [];
                proceed = true;
            }
        } else {
            proceed = (isArray(opts.whitelist) && opts.whitelist.length > 0);
        }

        return proceed;
    }

    function initialize() {
        UgKeyCharMap.initialize();

        CTRL_KEY_LISTENERS = {};

        // Backward-compatibility
        CTRL_KEY_LISTENERS.K = switchKeyboardMode;
        CTRL_KEY_LISTENERS.T = switchWritingDirection;
        // [Ctrl-T] can no longer be used for switching the writing direction in WebKit (Blink), see:
        //   https://code.google.com/p/chromium/issues/detail?id=33056
        // Therefore, use [Ctrl-Y] ('Y' as in the Uyghur word 'Yönilish')
        CTRL_KEY_LISTENERS.Y = switchWritingDirection;

        initialized = true;
    }

    function load() {
        var initialOptions = {};

        if (initialized) {
            return;
        }

        if (typeof (window.UG_VK_OPTS) === 'object') {
            initialOptions = window.UG_VK_OPTS;
        } else { // Backward-compatibility with bedit.js
            initialOptions = preprocessBeditJSOptions();
        }

        if (checkOptions(initialOptions)) {
            options = initialOptions;

            initialize();
            addEventListeners();
        }

        // API
        window.UG_VK = {
            addInputEventListeners: function (overrides) {
                if (overrides) {
                    options = {
                        all: 'all' in overrides ? !!overrides.all : options.all,
                        whitelist: isArray(overrides.whitelist) ?
                                overrides.whitelist : options.whitelist,
                        blacklist: isArray(overrides.blacklist) ?
                                overrides.blacklist : options.blacklist,
                        smartHamza: 'smartHamza' in overrides ?
                                !!overrides.smartHamza : options.smartHamza
                    };
                }

                if (!initialized) {
                    initialize();
                }

                removeEventListeners();
                addEventListeners();
            },
            addKeyboardModeChangeListener: function (listener) {
                if (!initialized) {
                    return;
                }

                if (isFunction(listener) && indexOf(keyboardModeChangeListeners, listener) < 0) {
                    keyboardModeChangeListeners.push(listener);
                }
            }
        };
    }

    function onDomReady(domReadyCallback) {
        var isDomReadyCallbackCalled = false,
            isDomReadyListenerAdded = false;

        function callDomReadyCallback() {
            if (!isDomReadyCallbackCalled) {
                isDomReadyCallbackCalled = true;
                domReadyCallback();
            }
        }

        function domReadyListener() {
            if ('removeEventListener' in document) {
                document.removeEventListener('DOMContentLoaded', domReadyListener, false);
            }

            callDomReadyCallback();
        }

        function ieScrollCheck() {
            if (isDomReadyCallbackCalled) {
                return;
            }

            // http://dean.edwards.name/weblog/2006/06/again/#comment334577
            // http://dean.edwards.name/weblog/2006/06/again/#comment367184
            try {
                document.body.doScroll('up');
            } catch (e) {
                setTimeout(ieScrollCheck, 50);
                return;
            }

            callDomReadyCallback();
        }

        function addDomReadyListener() {
            // document.readyState checking is reliable only in modern browsers.
            if (!('attachEvent' in document) && document.readyState !== 'loading') {
                callDomReadyCallback();
                return;
            }

            if (isDomReadyListenerAdded) {
                return;
            }
            isDomReadyListenerAdded = true;

            if ('addEventListener' in document) {
                document.addEventListener('DOMContentLoaded', domReadyListener, false);
                window.addEventListener('load', domReadyListener, false); // Fallback.
            } else {
                document.attachEvent('onload', domReadyListener); // Fallback.
                ieScrollCheck();
            }
        }

        addDomReadyListener();
    }

    var document = window.document,
        CTRL_KEY_LISTENERS,
        keyboardMode = {}, // 'en' or 'ug'
        keyboardModeChangeListeners = [],
        initialized = false,
        options,
        UgKeyCharMap = (function () {

            function initialize() {
                KEY_CHAR_MAP = {
                    a: 'ھ',
                    b: 'ب',
                    c: 'غ',
                    D: 'ژ',
                    d: 'د',
                    e: 'ې',
                    F: 'ف',
                    f: 'ا',
                    G: 'گ',
                    g: 'ە',
                    H: 'خ',
                    h: 'ى',
                    i: 'ڭ',
                    J: 'ج',
                    j: 'ق',
                    K: 'ۆ',
                    k: 'ك',
                    l: 'ل',
                    m: 'م',
                    n: 'ن',
                    o: 'و',
                    p: 'پ',
                    q: 'چ',
                    r: 'ر',
                    s: 'س',
                    t: 'ت',
                    u: 'ۇ',
                    v: 'ۈ',
                    w: 'ۋ',
                    x: 'ش',
                    y: 'ي',
                    z: 'ز',
                    '/': 'ئ',

                    // Arabic punctuation marks
                    ';': '؛',
                    '?': '؟',
                    ',': '،',
                    '_': '—',

                    // Invert parentheses, square brackets, and curly braces for RTL layout.
                    '(': ')',
                    ')': '(',
                    '[': ']',
                    ']': '[',
                    '{': '»',
                    '}': '«',
                    '<': '›',
                    '>': '‹'
                };

                UYGHUR_VOWELS = [
                    KEY_CHAR_MAP.f,
                    KEY_CHAR_MAP.g,
                    KEY_CHAR_MAP.e,
                    KEY_CHAR_MAP.h,
                    KEY_CHAR_MAP.o,
                    KEY_CHAR_MAP.u,
                    KEY_CHAR_MAP.K,
                    KEY_CHAR_MAP.v
                ];

                HAMZA = KEY_CHAR_MAP['/'];

                ARABIC_PUNCTUATION_MARKS = [
                    KEY_CHAR_MAP[';'],
                    KEY_CHAR_MAP['?'],
                    KEY_CHAR_MAP[',']
                ];
            }

            function isArabicLetter(ch) {
                var unicode = ch.charCodeAt(0);

                return (unicode >= ARABIC_START && unicode < ARABIC_END) &&
                    indexOf(ARABIC_PUNCTUATION_MARKS, ch) < 0;
            }

            function isUyghurVowel(ch) {
                return isArabicLetter(ch) && indexOf(UYGHUR_VOWELS, ch) >= 0;
            }

            function prependHamzaMaybe(ch, precedingChar) {
                var result = ch;

                if (isUyghurVowel(ch)) {
                    if (!precedingChar) {
                        result = HAMZA + ch;
                    } else {
                        if (!isArabicLetter(precedingChar) || isUyghurVowel(precedingChar)) {
                            result = HAMZA + ch;
                        }
                    }
                }

                return result;
            }

            function getUgChar(c, isSmartHamza, precedingChar) {
                var ugChar;

                ugChar = KEY_CHAR_MAP[c];

                if (ugChar && isSmartHamza) {
                    ugChar = prependHamzaMaybe(ugChar, precedingChar);
                }

                return ugChar;
            }

            var ARABIC_START = 0x0600, // Starting code point of Unicode Arabic range
                ARABIC_END = 0x06FF,   // Ending code point of Unicode Arabic range
                KEY_CHAR_MAP,
                UYGHUR_VOWELS,
                ARABIC_PUNCTUATION_MARKS,
                HAMZA;

            return {
                initialize: initialize,
                getUgChar: getUgChar
            };

        } ());

    onDomReady(load);
}) (window);

