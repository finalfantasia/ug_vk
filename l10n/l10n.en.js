var l10n = {
    name: 'ug_vk',
    description: {
        short: 'A virtual keyboard for the Uyghur language written in vanilla JavaScript',
        long: 'A virtual keyboard for the Uyghur language written in JavaScript. This is an optimized and modernized fork of the original work (<a href="http://www.yulghun.com/news/vkb.html">bedit.js</a>) written by Mr. Muhemmed Abdullah.'
    },
    gitHub: {
        viewProject: 'View project on',
        download: 'Download',
        fileType: {
            zip: 'zip file',
            tar_gz: '.tar.gz file'
        },
        maintainedBy: 'is maintained by'
    },
    whatsNew: {
        title: 'What\'s New',
        features: [
            'It\'s tiny (thus transfers and loads faster)! The uglified/minified/gzipped version is only 2002 bytes!',
            '"Auto-magically" prepends Hamza to Uyghur vowels based on their positions in text (W3C standard-compliant layout engines only, e.g. Gecko, WebKit, Blink, and Trident 7.0+);',
            'Adds the ability to switch the keyboard mode via a horizontal swipe gesture in browsers on iOS and Android;',
            'Allows using [Ctrl-Y] ([Command-Y] on Mac), along with [Ctrl-T] ([Command-T] on Mac) as it no longer works in Google Chrome 4+, to switch the writing direction in the browsers where [Ctrl-T] (New Tab) is a browser-reserved shortcut;',
            'Now each input element maintains its own keyboard mode independently of other elements;',
            'Makes the virtual keyboard standard-compliant;',
            'Implements the right way of loading the script for IE 8- when DOM is ready, meaning more reliable!',
            'Removes the code for conversion between UEY and ULY;',
            'Removes the code for conversion between the obsolete Alkatip encoding and Unicode;',
            'Removes most of the global variables (including <code>window.addchar</code> and <code>window.proc_kd</code>, but keeps <code>bedit_allow</code>, <code>bedit_deny</code>, and <code>attachAll</code> for backward-compatibility) by enclosing the the whole code in a function scope;',
            'Removes the workaround to fix keyboard event issues with older versions of Opera;',
            'Code clean-ups.'
        ]
    },
    tryIt: {
        title: 'Try it',
        features: [
            'Try typing Uyghur words such as <span class="bidi-override-ltr"><span lang="ug">ئالىم</span>, <span lang="ug">پائال</span>, <span lang="ug">ئاتا-ئانا</span>, <span lang="ug">نۇقتىئىينەزەر</span>,</span> and <span lang="ug">1-ئەزا</span> without using the [/] (<span lang="ug">ئ</span>, hamza) key, this virtual keyboard "auto-magically" adds hamza for you whenever it "thinks" it\'s necessary;',
            'If you\'re visiting this page on an iOS or Android device, try swiping across the input box above to switch the keyboard mode between Uyghur and English; Otherwise:',
            'Press [Ctrl-K] to switch the keyboard mode between Uyghur and English;',
            'Press [Ctrl-Y] to switch the writing direction between RTL and LTR.'
        ]
    },
    howToUse: {
        title: 'How to Use',
        instructions: {
            varDeclarations: 'Put a <code>&lt;script&gt;</code> block at the bottom of your page right before <code>&lt;/body&gt;</code> to specify the elements (by the values of their <code>name</code> attribute) to which you want to add the virtual keyboard support, e.g.:',
            separateUsingColon: '// Use colons (:) to separate names.',
            attachAll: {
                definition: '// Add the virtual keyboard support to all the text input and textarea elements.',
                comment: '// Note that this is optional if you defined bedit_deny.'
            },
            bedit_deny: '// Blacklist the specified elements so that they won\'t be added the virtual keyboard support.',
            bedit_allow: '// You may use this option mutually exclusively with the options above to explicitly specify only those elements which will be added the virtual keyboard support.',
            ug_vkInclusion: {
                recommended: 'Put ug_vk.js or the uglified/minimized version ug_vk.min.js between the <code>&lt;script&gt;</code> block above and <code>&lt;/body&gt;</code>, e.g.:',
                alternative: 'Alternatively, you may put the global variable declarations inside ug_vk.js (or ug_vk.min.js) if you so choose, although not recommeded, e.g.:'
            }
       }
    }
};

