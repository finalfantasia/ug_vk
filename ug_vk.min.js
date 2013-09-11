!function(e){"use strict"
function t(e){return String.fromCharCode(e)}function n(e,t){var n
if(e&&e.length)for(n=0;n<e.length;n++)if(e[n]===t)return n
return-1}function r(){p={a:t(1726),b:t(1576),c:t(1594),D:t(1688),d:t(1583),e:t(1744),F:t(1601),f:t(1575),G:t(1711),g:t(1749),H:t(1582),h:t(1609),i:t(1709),J:t(1580),j:t(1602),K:t(1734),k:t(1603),l:t(1604),m:t(1605),n:t(1606),o:t(1608),p:t(1662),q:t(1670),r:t(1585),s:t(1587),t:t(1578),u:t(1735),v:t(1736),w:t(1739),x:t(1588),y:t(1610),z:t(1586),"/":t(1574),";":t(1563),"?":t(1567),",":t(1548),"(":")",")":"(","[":"]","]":"[","{":t(187),"}":t(171),"<":">",">":"<"},E=[p.f,p.g,p.e,p.h,p.o,p.u,p.K,p.v],L=p["/"],y=[p[";"],p["?"],p[","]],C={},C.K=a,C.Y=o}function a(e){var t=e.srcElement||e.target
D[t.name]=1-D[t.name]}function o(e){var t=e.srcElement||e.target
t.style.direction="ltr"===t.style.direction?"rtl":"ltr"}function c(e){var t=e.charCodeAt(0)
return t>=w&&k>t&&n(y,e)<0}function i(e){return c(e)&&n(E,e)>=0}function l(e,t){var n,r=e,a=t.selectionStart
return i(e)&&(0===a?r=L+e:(n=t.value[a-1],r=!c(n)||i(n)?L+e:e)),r}function u(e,t){var n,r,a,o
b.selection&&b.selection.createRange?b.selection.createRange().text=t:(n=e.selectionStart,"textarea"===e.type&&e.scrollTop&&(a=e.scrollTop,o=e.scrollLeft),t=l(t,e),e.value=e.value.substring(0,e.selectionStart)+t+e.value.substring(e.selectionEnd),a&&(e.scrollTop=a,e.scrollLeft=o),r=n+t.length,e.setSelectionRange(r,r))}function s(e,t){function n(){e.removeEventListener("touchmove",r),e.removeEventListener("touchend",a),c=null,i=null,l=null,u=null}function r(e){var t
e.touches.length>1?n():(l=e.touches[0].pageX-c,t=e.touches[0].pageY-i,u&&0>u&&l>0||u>0&&0>l||Math.abs(t)>d?n():(u=l,e.preventDefault()))}function a(){var r=l>0?"RIGHT":"LEFT",a=Math.abs(l)
n(),a>s&&t({target:e,direction:r})}function o(t){1===t.touches.length&&(c=t.touches[0].pageX,i=t.touches[0].pageY,e.addEventListener("touchmove",r),e.addEventListener("touchend",a))}var c,i,l,u,s=50,d=15
e.addEventListener("touchstart",o)}function d(n){var r=n||e.event,a=r.ctrlKey||r.metaKey,o=r.keyCode||r.which,c=t(o).toUpperCase()
a&&C[c]&&(C[c](r),r.preventDefault?(r.preventDefault(),r.stopPropagation()):(r.returnValue=!1,r.cancelBubble=!0))}function v(n){var r=n||e.event,a=r.srcElement||r.target,o=r.ctrlKey||r.metaKey,c=r.keyCode||r.which,i=t(c),l=/^[A-Z]{1}$/.test(i.toUpperCase()),s=!1
o||0!==D[a.name]||(p[i]?(r.keyCode&&!r.which?r.keyCode=p[i].charCodeAt(0):u(a,p[i]),s=!0):l&&(r.returnValue=!1,s=!0)),s&&(r.preventDefault?(r.preventDefault(),r.stopPropagation()):r.cancelBubble=!0)}function f(){var e,t,n,r=[]
for(e=b.getElementsByTagName("input"),t=b.getElementsByTagName("textarea"),n=0;n<e.length;n++)"text"===e[n].type.toLowerCase()&&r.push(e[n])
for(n=0;n<t.length;n++)r.push(t[n])
return r}function h(e,t,n){e.addEventListener?(e.removeEventListener(t,n,!1),e.addEventListener(t,n,!1)):e.attachEvent&&(e.detachEvent("on"+t,n),e.attachEvent("on"+t,n))}function g(){var e,t,r,o=!0
if(S?x.length&&(o=!1,x=x.split(T)):(K.length&&(o=!1,K=K.split(T)),x.length&&(o=!1,S=!0,x=x.split(T))),!o)if(e=f(),S)for(r=0;r<e.length;r++)t=e[r],n(x,t.name)<0&&(h(t,"keydown",d),h(t,"keypress",v),s(t,a),D[t.name]=0)
else for(r=0;r<e.length;r++)t=e[r],n(K,t.name)>=0&&(h(t,"keydown",d),h(t,"keypress",v),s(t,a),D[t.name]=0)}function m(){r(),g()}var p,E,y,L,C,b=e.document,w=1536,k=1791,T=":",D={},S=e.attachAll||!1,K=e.bedit_allow||[],x=e.bedit_deny||[]
!function(){function t(){if(!o){if(!b.body)return setTimeout(t,1)
o=!0,m()}}function n(){if(b.addEventListener)b.removeEventListener("DOMContentLoaded",n)
else{if(!b.attachEvent)return
b.detachEvent("onreadystatechange",n)}t()}function r(){if(!o){try{b.documentElement.doScroll("left")}catch(e){return setTimeout(r,1),void 0}t()}}function a(){var a=!1
if(!c){if(c=!0,"loading"!==b.readyState)return t(),void 0
if(b.addEventListener)b.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)
else if(b.attachEvent){b.attachEvent("onreadystatechange",n),b.attachEvent("onload",n)
try{a=!e.frameElement}catch(o){}b.documentElement.doScroll&&a&&r()}}}var o=!1,c=!1
a()}()}(window)
