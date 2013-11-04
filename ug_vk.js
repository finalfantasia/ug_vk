/*
    ug_vk.js (https://github.com/finalfantasia/ug_vk)
    The MIT License (MIT)
    Copyright (c) 2013 Abdussalam Abdurrahman (abdusalam.abdurahman@gmail.com)
*/

(function (window) {
    'use strict';

    var document = window.document,
        KEY_CHAR_MAP,
        ARABIC_START = 0x0600, // Starting Unicode point of Arabic range
        ARABIC_END = 0x06FF,   // Ending Unicode point of Arabic range
        UYGHUR_VOWELS,
        ARABIC_PUNCTUATION_MARKS,
        HAMZA,
        CTRL_KEY_LISTENERS,
        DELIMITER = ':',
        keyboardMode = {}, // 0: Uyghur, 1: Latin
        addToAll = window.attachAll || false,
        whitelist = window.bedit_allow || [],
        blacklist = window.bedit_deny || [];

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

    function initialize() {
        // ASCII -> Unicode of Arabic/Uyghur characters
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

        CTRL_KEY_LISTENERS = {};

        CTRL_KEY_LISTENERS.K = switchKeyboardMode;
        // [Ctrl-T] can no longer be used for switching the writing direction in WebKit (Blink), see:
        //   https://code.google.com/p/chromium/issues/detail?id=33056
        // Therefore, use [Ctrl-Y] ('Y' as in the Uyghur word 'Yönilish')
        CTRL_KEY_LISTENERS.Y = switchWritingDirection;
    }

    function switchKeyboardMode(event) {
        var element = event.srcElement || event.target;

        keyboardMode[element.name] = 1 - keyboardMode[element.name];
    }

    function switchWritingDirection(event) {
        var element = event.srcElement || event.target;

        element.style.direction = (element.style.direction === 'ltr' ? 'rtl' : 'ltr');
    }

    function isArabicLetter(ch) {
        var unicode = ch.charCodeAt(0);

        return (unicode >= ARABIC_START && unicode < ARABIC_END) && indexOf(ARABIC_PUNCTUATION_MARKS, ch) < 0;
    }

    function isUyghurVowel(ch) {
        return isArabicLetter(ch) && indexOf(UYGHUR_VOWELS, ch) >= 0;
    }

    function prependHamzaConditionally(ch, element) {
        var result = ch,
            start = element.selectionStart,
            previousChar;

        if (isUyghurVowel(ch)) {
            if (start === 0) { // cursor is at the begginning of the input area
                result = HAMZA + ch;
            } else {
                previousChar = element.value[start - 1];

                if (!isArabicLetter(previousChar) || isUyghurVowel(previousChar)) {
                    result = HAMZA + ch;
                } else {
                    result = ch;
                }
            }
        }

        return result;
    }

    function insert(element, ch) {
        var previousSelectionStart,
            currentSelectionStart,
            previousScrollTop,
            previousScrollLeft;

        if (document.selection && document.selection.createRange) { // Trident 5.0+
            document.selection.createRange().text = ch;
        } else { // W3C
            previousSelectionStart = element.selectionStart;

            // Gecko scrolls to top in textarea after input, fix this.
            if (element.type === 'textarea' && element.scrollTop) {
                previousScrollTop = element.scrollTop;
                previousScrollLeft = element.scrollLeft;
            }

            // Automatically prepend hamza if ch is an Uyghur vowel and the conditions hold true.
            ch = prependHamzaConditionally(ch, element);

            element.value = element.value.substring(0, element.selectionStart) +
                ch + element.value.substring(element.selectionEnd);

            if (previousScrollTop) {
                element.scrollTop = previousScrollTop;
                element.scrollLeft = previousScrollLeft;
            }

            currentSelectionStart = previousSelectionStart + ch.length;
            element.setSelectionRange(currentSelectionStart, currentSelectionStart);
        }
    }

    function addSwipeListener(el, listener) {
        var startX, startY, dx, direction,
            X_THRESHOLD = 50,
            Y_THRESHOLD = 15;

        function cancelTouch() {
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);

            startX = null;
            startY = null;
            dx = null;
            direction = null;
        }

        function onTouchMove(e) {
            var dy;

            if (e.touches.length > 1) {
                cancelTouch();
            } else {
                dx = e.touches[0].pageX - startX;
                dy = e.touches[0].pageY - startY;

                if ((direction && (direction < 0 && dx > 0) || (direction > 0 && dx < 0)) ||
                    Math.abs(dy) > Y_THRESHOLD) {
                    cancelTouch();
                } else {
                    direction = dx;
                    e.preventDefault();
                }
            }
        }

        function onTouchEnd(e) {
            var distance = Math.abs(dx);

            cancelTouch();

            if (distance > X_THRESHOLD) {
                listener({ target: el, direction: (dx > 0 ? 'RIGHT' : 'LEFT') });
            }
        }

        function onTouchStart(e) {
            if (e.touches.length === 1) {
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;

                el.addEventListener('touchmove', onTouchMove);
                el.addEventListener('touchend', onTouchEnd);
            }
        }

        el.addEventListener('touchstart', onTouchStart);
    }

    function keydownListener(e) {
        var event = e || window.event,
            isMetaKey = event.ctrlKey || event.metaKey,
            keyCode = event.keyCode || event.which,
            c = String.fromCharCode(keyCode).toUpperCase();

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
        var event = e || window.event,
            target = event.srcElement || event.target,
            isMetaKey = event.ctrlKey || event.metaKey,
            keyCode = event.keyCode || event.which,
            c = String.fromCharCode(keyCode),
            isAlphabetic = /^[A-Z]{1}$/.test(c.toUpperCase()),
            preventDefaultAndStopPropagation = false;

        // The extra check for the meta key ([Ctrl]) is because:
        //   https://bugzilla.mozilla.org/show_bug.cgi?id=501496
        if (!isMetaKey && keyboardMode[target.name] === 0) {
            if (KEY_CHAR_MAP[c]) {
                if (event.keyCode && !event.which) { // Trident 4.0-
                    event.keyCode = KEY_CHAR_MAP[c].charCodeAt(0);
                } else {                             // W3C event is read-only.
                    insert(target, KEY_CHAR_MAP[c]);
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

    function getAllEditBoxes() {
        var inputs,
            textAreas,
            all = [],
            i;

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
        var all,
            element,
            cancel = true,
            i;

        if (!addToAll) {
            if (whitelist.length) {
                cancel = false;
                whitelist = whitelist.split(DELIMITER);
            }

            if (blacklist.length) {
                cancel = false;
                addToAll = true; // A blacklist by itself implies 'addToAll'.
                blacklist = blacklist.split(DELIMITER);
            }
        } else {
            if (blacklist.length) {
                cancel = false;
                blacklist = blacklist.split(DELIMITER);
            }
        }

        if (cancel) {
            return;
        }

        all = getAllEditBoxes();

        if (addToAll) {
            for (i = 0; i < all.length; i++) {
                element = all[i];

                if (indexOf(blacklist, element.name) < 0) {
                    addEventListener(element, 'keydown', keydownListener);
                    addEventListener(element, 'keypress', keypressListener);
                    addSwipeListener(element, switchKeyboardMode);

                    // Initialize the keyboard mode for this element.
                    keyboardMode[element.name] = 0;
                }
            }
        } else {
            for (i = 0; i < all.length; i++) {
                element = all[i];

                if (indexOf(whitelist, element.name) >= 0) {
                    addEventListener(element, 'keydown', keydownListener);
                    addEventListener(element, 'keypress', keypressListener);
                    addSwipeListener(element, switchKeyboardMode);

                    // Initialize the keyboard mode for this element.
                    keyboardMode[element.name] = 0;
                }
            }
        }
    }

    function load() {
        initialize();
        addEventListeners();
    }

    (function onDomReady() {
        var isDomReadyCallbackCalled = false,
            isDomReadyListenerAdded = false;

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

        addDomReadyListener();
    }) ();
}) (window);

