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
        inputMode = {}, // 0: Uyghur, 1: Latin
        addToAll = window.attachAll || false,
        whitelist = window.bedit_allow || [],
        blacklist = window.bedit_deny || [];

    function getChar(unicode) {
        return String.fromCharCode(unicode);
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

    function initialize() {
        // ASCII -> Unicode of Uyghur characters
        KEY_CHAR_MAP = {};

        KEY_CHAR_MAP.a    = getChar(0x06BE); // h
        KEY_CHAR_MAP.b    = getChar(0x0628); // b
        KEY_CHAR_MAP.c    = getChar(0x063A); // gh
        KEY_CHAR_MAP.D    = getChar(0x0698); // zh
        KEY_CHAR_MAP.d    = getChar(0x062F); // d
        KEY_CHAR_MAP.e    = getChar(0x06D0); // :e
        KEY_CHAR_MAP.F    = getChar(0x0641); // f
        KEY_CHAR_MAP.f    = getChar(0x0627); // a
        KEY_CHAR_MAP.G    = getChar(0x06AF); // g
        KEY_CHAR_MAP.g    = getChar(0x06D5); // e
        KEY_CHAR_MAP.H    = getChar(0x062E); // x
        KEY_CHAR_MAP.h    = getChar(0x0649); // i
        KEY_CHAR_MAP.i    = getChar(0x06AD); // ng
        KEY_CHAR_MAP.J    = getChar(0x062C); // j
        KEY_CHAR_MAP.j    = getChar(0x0642); // q
        KEY_CHAR_MAP.K    = getChar(0x06C6); // :o
        KEY_CHAR_MAP.k    = getChar(0x0643); // k
        KEY_CHAR_MAP.l    = getChar(0x0644); // l
        KEY_CHAR_MAP.m    = getChar(0x0645); // m
        KEY_CHAR_MAP.n    = getChar(0x0646); // n
        KEY_CHAR_MAP.o    = getChar(0x0648); // o
        KEY_CHAR_MAP.p    = getChar(0x067E); // p
        KEY_CHAR_MAP.q    = getChar(0x0686); // ch
        KEY_CHAR_MAP.r    = getChar(0x0631); // r
        KEY_CHAR_MAP.s    = getChar(0x0633); // s
        KEY_CHAR_MAP.t    = getChar(0x062A); // t
        KEY_CHAR_MAP.u    = getChar(0x06C7); // u
        KEY_CHAR_MAP.v    = getChar(0x06C8); // :u
        KEY_CHAR_MAP.w    = getChar(0x06CB); // w
        KEY_CHAR_MAP.x    = getChar(0x0634); // sh
        KEY_CHAR_MAP.y    = getChar(0x064A); // y
        KEY_CHAR_MAP.z    = getChar(0x0632); // z
        KEY_CHAR_MAP['/'] = getChar(0x0626); // hamza

        // Uyghur punctuation marks
        KEY_CHAR_MAP[';'] = getChar(0x061B);
        KEY_CHAR_MAP['?'] = getChar(0x061F);
        KEY_CHAR_MAP[','] = getChar(0x060C);

        // Invert parentheses, square brackets, and curly braces for RTL layout.
        KEY_CHAR_MAP['('] = ')';
        KEY_CHAR_MAP[')'] = '(';
        KEY_CHAR_MAP['['] = ']';
        KEY_CHAR_MAP[']'] = '[';
        KEY_CHAR_MAP['}'] = getChar(0x00AB);
        KEY_CHAR_MAP['{'] = getChar(0x00BB);
        KEY_CHAR_MAP['<'] = '>'; // Sticking to the standard.
        KEY_CHAR_MAP['>'] = '<'; // Sticking to the standard.

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

        CTRL_KEY_LISTENERS.K = toggleInputMode;
        // [Ctrl-T] can no longer be used for inverting the input direction in WebKit (Blink), see:
        //   https://code.google.com/p/chromium/issues/detail?id=33056
        // Therefore, use 'Y' ('Y' as in the Uyghur word 'Yönilish')
        CTRL_KEY_LISTENERS.Y = toggleInputDirection;
    }

    function toggleInputMode(event) {
        var element = event.srcElement || event.target;

        inputMode[element.name] = 1 - inputMode[element.name];
    }

    function toggleInputDirection(event) {
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
            start = element.selectionStart;

        if (isUyghurVowel(ch)) {
            if (start === 0) { // cursor is at the begginning of the input area
                result = HAMZA + ch;
            } else {
                // by using 'start' only, this if statement takes care of both cases of empty-selection and non-empty selection.
                if (!isArabicLetter(element.value[start - 1]) || isUyghurVowel(element.value[start - 1])) {
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

    function keydownListener(e) {
        var event = e || window.event,
            isMetaKey = event.ctrlKey || event.metaKey,
            keyCode = event.keyCode || event.which,
            c = getChar(keyCode).toUpperCase();

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
            c = getChar(keyCode),
            isAlphabetic = /^[A-Z]{1}$/.test(c.toUpperCase()),
            preventDefaultAndStopPropagation = false;

        // The extra check for the meta key ([Ctrl]) is because:
        //   https://bugzilla.mozilla.org/show_bug.cgi?id=501496
        if (!isMetaKey && inputMode[target.name] === 0) {
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

    function addKeyboardEventListeners() {
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

                    // Initialize the input mode for this element.
                    inputMode[element.name] = 0;
                }
            }
        } else {
            for (i = 0; i < all.length; i++) {
                element = all[i];

                if (indexOf(whitelist, element.name) >= 0) {
                    addEventListener(element, 'keydown', keydownListener);
                    addEventListener(element, 'keypress', keypressListener);

                    // Initialize the input mode for this element.
                    inputMode[element.name] = 0;
                }
            }
        }
    }

    function load() {
        initialize();
        addKeyboardEventListeners();
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

