!function(e){"use strict"
function t(e){return String.fromCharCode(e)}function n(){h.a=t(1726),h.b=t(1576),h.c=t(1594),h.D=t(1688),h.d=t(1583),h.e=t(1744),h.F=t(1601),h.f=t(1575),h.G=t(1711),h.g=t(1749),h.H=t(1582),h.h=t(1609),h.i=t(1709),h.J=t(1580),h.j=t(1602),h.K=t(1734),h.k=t(1603),h.l=t(1604),h.m=t(1605),h.n=t(1606),h.o=t(1608),h.p=t(1662),h.q=t(1670),h.r=t(1585),h.s=t(1587),h.t=t(1578),h.u=t(1735),h.v=t(1736),h.w=t(1739),h.x=t(1588),h.y=t(1610),h.z=t(1586),h["/"]=t(1574),h[";"]=t(1563),h["?"]=t(1567),h[","]=t(1548),h["("]=")",h[")"]="(",h["["]="]",h["]"]="[",h["}"]=t(171),h["{"]=t(187),h["<"]=">",h[">"]="<",g.K=a,g.Y=r}function a(e){var t=e.srcElement||e.target
p[t.name]=1-p[t.name]}function r(e){var t=e.srcElement||e.target
t.style.direction="ltr"===t.style.direction?"rtl":"ltr"}function o(e,t){var n,a,r,o
v.selection&&v.selection.createRange?v.selection.createRange().text=t:(n=e.selectionStart,"textarea"===e.type&&e.scrollTop&&(r=e.scrollTop,o=e.scrollLeft),e.value=e.value.substring(0,e.selectionStart)+t+e.value.substring(e.selectionEnd),r&&(e.scrollTop=r,e.scrollLeft=o),a=n+t.length,e.setSelectionRange(a,a))}function l(n){var a=n||e.event,r=a.ctrlKey||a.metaKey,o=a.keyCode||a.which,l=t(o).toUpperCase()
r&&g[l]&&(g[l](a),a.preventDefault?(a.preventDefault(),a.stopPropagation()):(a.returnValue=!1,a.cancelBubble=!0))}function i(n){var a=n||e.event,r=a.srcElement||a.target,l=a.ctrlKey||a.metaKey,i=a.keyCode||a.which,c=t(i),s=/^[A-Z]{1}$/.test(c.toUpperCase()),u=!1
l||0!==p[r.name]||(h[c]?(a.keyCode&&!a.which?a.keyCode=h[c].charCodeAt(0):o(r,h[c]),u=!0):s&&(a.returnValue=!1,u=!0)),u&&(a.preventDefault?(a.preventDefault(),a.stopPropagation()):a.cancelBubble=!0)}function c(e,t){var n
if(e&&e.length)for(n=0;n<e.length;n++)if(e[n]===t)return n
return-1}function s(){var e,t,n,a=[]
for(e=v.getElementsByTagName("input"),t=v.getElementsByTagName("textarea"),n=0;n<e.length;n++)"text"===e[n].type.toLowerCase()&&a.push(e[n])
for(n=0;n<t.length;n++)a.push(t[n])
return a}function u(e,t,n){e.addEventListener?(e.removeEventListener(t,n,!1),e.addEventListener(t,n,!1)):e.attachEvent&&(e.detachEvent("on"+t,n),e.attachEvent("on"+t,n))}function d(){var e,t,n,a=!0
if(y?L.length&&(a=!1,L=L.split(m)):(E.length&&(a=!1,E=E.split(m)),L.length&&(a=!1,y=!0,L=L.split(m))),!a)if(e=s(),y)for(n=0;n<e.length;n++)t=e[n],c(L,t.name)<0&&(u(t,"keydown",l),u(t,"keypress",i),p[t.name]=0)
else for(n=0;n<e.length;n++)t=e[n],c(E,t.name)>=0&&(u(t,"keydown",l),u(t,"keypress",i),p[t.name]=0)}function f(){n(),d()}var v=e.document,h={},g={},m=":",p={},y=e.attachAll||!1,E=e.bedit_allow||[],L=e.bedit_deny||[]
!function(){function t(){if(!o){if(!v.body)return setTimeout(t,1)
o=!0,f()}}function n(){if(v.addEventListener)v.removeEventListener("DOMContentLoaded",n)
else{if(!v.attachEvent)return
v.detachEvent("onreadystatechange",n)}t()}function a(){if(!o){try{v.documentElement.doScroll("left")}catch(e){return setTimeout(a,1),void 0}t()}}function r(){var r=!1
if(!l){if(l=!0,"loading"!==v.readyState)return t(),void 0
if(v.addEventListener)v.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)
else if(v.attachEvent){v.attachEvent("onreadystatechange",n),v.attachEvent("onload",n)
try{r=!e.frameElement}catch(o){}v.documentElement.doScroll&&r&&a()}}}var o=!1,l=!1
r()}()}(window)

