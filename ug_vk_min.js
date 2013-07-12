!function(e){"use strict"
function t(e){return String.fromCharCode(e)}function n(e,t){var n
if(e&&e.length)for(n=0;n<e.length;n++)if(e[n]===t)return n
return-1}function r(){m={},m.a=t(1726),m.b=t(1576),m.c=t(1594),m.D=t(1688),m.d=t(1583),m.e=t(1744),m.F=t(1601),m.f=t(1575),m.G=t(1711),m.g=t(1749),m.H=t(1582),m.h=t(1609),m.i=t(1709),m.J=t(1580),m.j=t(1602),m.K=t(1734),m.k=t(1603),m.l=t(1604),m.m=t(1605),m.n=t(1606),m.o=t(1608),m.p=t(1662),m.q=t(1670),m.r=t(1585),m.s=t(1587),m.t=t(1578),m.u=t(1735),m.v=t(1736),m.w=t(1739),m.x=t(1588),m.y=t(1610),m.z=t(1586),m["/"]=t(1574),m[";"]=t(1563),m["?"]=t(1567),m[","]=t(1548),m["("]=")",m[")"]="(",m["["]="]",m["]"]="[",m["}"]=t(171),m["{"]=t(187),m["<"]=">",m[">"]="<",p=[m.f,m.g,m.e,m.h,m.o,m.u,m.K,m.v],E=m["/"],y=[m[";"],m["?"],m[","]],C={},C.K=a,C.Y=o}function a(e){var t=e.srcElement||e.target
S[t.name]=1-S[t.name]}function o(e){var t=e.srcElement||e.target
t.style.direction="ltr"===t.style.direction?"rtl":"ltr"}function l(e){var t=e.charCodeAt(0)
return t>=b&&w>t&&n(y,e)<0}function i(e){return l(e)&&n(p,e)>=0}function c(e,t){var n=e,r=t.selectionStart
return i(e)&&(n=0===r?E+e:!l(t.value[r-1])||i(t.value[r-1])?E+e:e),n}function u(e,t){var n,r,a,o
L.selection&&L.selection.createRange?L.selection.createRange().text=t:(n=e.selectionStart,"textarea"===e.type&&e.scrollTop&&(a=e.scrollTop,o=e.scrollLeft),t=c(t,e),e.value=e.value.substring(0,e.selectionStart)+t+e.value.substring(e.selectionEnd),a&&(e.scrollTop=a,e.scrollLeft=o),r=n+t.length,e.setSelectionRange(r,r))}function s(n){var r=n||e.event,a=r.ctrlKey||r.metaKey,o=r.keyCode||r.which,l=t(o).toUpperCase()
a&&C[l]&&(C[l](r),r.preventDefault?(r.preventDefault(),r.stopPropagation()):(r.returnValue=!1,r.cancelBubble=!0))}function f(n){var r=n||e.event,a=r.srcElement||r.target,o=r.ctrlKey||r.metaKey,l=r.keyCode||r.which,i=t(l),c=/^[A-Z]{1}$/.test(i.toUpperCase()),s=!1
o||0!==S[a.name]||(m[i]?(r.keyCode&&!r.which?r.keyCode=m[i].charCodeAt(0):u(a,m[i]),s=!0):c&&(r.returnValue=!1,s=!0)),s&&(r.preventDefault?(r.preventDefault(),r.stopPropagation()):r.cancelBubble=!0)}function d(){var e,t,n,r=[]
for(e=L.getElementsByTagName("input"),t=L.getElementsByTagName("textarea"),n=0;n<e.length;n++)"text"===e[n].type.toLowerCase()&&r.push(e[n])
for(n=0;n<t.length;n++)r.push(t[n])
return r}function v(e,t,n){e.addEventListener?(e.removeEventListener(t,n,!1),e.addEventListener(t,n,!1)):e.attachEvent&&(e.detachEvent("on"+t,n),e.attachEvent("on"+t,n))}function h(){var e,t,r,a=!0
if(D?T.length&&(a=!1,T=T.split(k)):(K.length&&(a=!1,K=K.split(k)),T.length&&(a=!1,D=!0,T=T.split(k))),!a)if(e=d(),D)for(r=0;r<e.length;r++)t=e[r],n(T,t.name)<0&&(v(t,"keydown",s),v(t,"keypress",f),S[t.name]=0)
else for(r=0;r<e.length;r++)t=e[r],n(K,t.name)>=0&&(v(t,"keydown",s),v(t,"keypress",f),S[t.name]=0)}function g(){r(),h()}var m,p,y,E,C,L=e.document,b=1536,w=1791,k=":",S={},D=e.attachAll||!1,K=e.bedit_allow||[],T=e.bedit_deny||[]
!function(){function t(){if(!o){if(!L.body)return setTimeout(t,1)
o=!0,g()}}function n(){if(L.addEventListener)L.removeEventListener("DOMContentLoaded",n)
else{if(!L.attachEvent)return
L.detachEvent("onreadystatechange",n)}t()}function r(){if(!o){try{L.documentElement.doScroll("left")}catch(e){return setTimeout(r,1),void 0}t()}}function a(){var a=!1
if(!l){if(l=!0,"loading"!==L.readyState)return t(),void 0
if(L.addEventListener)L.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)
else if(L.attachEvent){L.attachEvent("onreadystatechange",n),L.attachEvent("onload",n)
try{a=!e.frameElement}catch(o){}L.documentElement.doScroll&&a&&r()}}}var o=!1,l=!1
a()}()}(window)
