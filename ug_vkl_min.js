!function(e){"use strict"
function t(e){return String.fromCharCode(e)}function n(){g.a=t(1726),g.b=t(1576),g.c=t(1594),g.D=t(1688),g.d=t(1583),g.e=t(1744),g.F=t(1601),g.f=t(1575),g.G=t(1711),g.g=t(1749),g.H=t(1582),g.h=t(1609),g.i=t(1709),g.J=t(1580),g.j=t(1602),g.K=t(1734),g.k=t(1603),g.l=t(1604),g.m=t(1605),g.n=t(1606),g.o=t(1608),g.p=t(1662),g.q=t(1670),g.r=t(1585),g.s=t(1587),g.t=t(1578),g.u=t(1735),g.v=t(1736),g.w=t(1739),g.x=t(1588),g.y=t(1610),g.z=t(1586),g["/"]=t(1574),g[";"]=t(1563),g["?"]=t(1567),g[","]=t(1548),g["("]=")",g[")"]="(",g["["]="]",g["]"]="[",g["}"]=t(171),g["{"]=t(187),g["<"]=">",g[">"]="<",m.K=a,m.Y=r}function a(e){var t=e.srcElement||e.target
y[t.name]=1-y[t.name]}function r(e){var t=e.srcElement||e.target
t.style.direction="ltr"===t.style.direction?"rtl":"ltr"}function o(e,t){var n,a,r,o
h.selection&&h.selection.createRange?h.selection.createRange().text=t:(n=e.selectionStart,"textarea"===e.type&&e.scrollTop&&(r=e.scrollTop,o=e.scrollLeft),e.value=e.value.substring(0,e.selectionStart)+t+e.value.substring(e.selectionEnd),r&&(e.scrollTop=r,e.scrollLeft=o),a=n+t.length,e.setSelectionRange(a,a))}function l(n){var a=n||e.event,r=a.ctrlKey||a.metaKey,o=a.keyCode||a.which,l=t(o).toUpperCase()
r&&m[l]&&(m[l](a),a.preventDefault?(a.preventDefault(),a.stopPropagation()):(a.returnValue=!1,a.cancelBubble=!0))}function i(n){var a=n||e.event,r=a.srcElement||a.target,l=a.ctrlKey||a.metaKey,i=a.keyCode||a.which,c=t(i),s=/^[A-Z]{1}$/.test(c.toUpperCase()),u=!1
l||0!==y[r.name]||(g[c]?(a.keyCode&&!a.which?a.keyCode=g[c].charCodeAt(0):o(r,g[c]),u=!0):s&&(a.returnValue=!1,u=!0)),u&&(a.preventDefault?(a.preventDefault(),a.stopPropagation()):a.cancelBubble=!0)}function c(e,t){var n
if(e&&e.length)for(n=0;n<e.length;n++)if(e[n]===t)return n
return-1}function s(){var e,t,n,a=[]
for(e=h.getElementsByTagName("input"),t=h.getElementsByTagName("textarea"),n=0;n<e.length;n++)"text"===e[n].type.toLowerCase()&&a.push(e[n])
for(n=0;n<t.length;n++)a.push(t[n])
return a}function u(e,t,n){e.addEventListener?(e.removeEventListener(t,n,!1),e.addEventListener(t,n,!1)):e.attachEvent&&(e.detachEvent("on"+t,n),e.attachEvent("on"+t,n))}function d(){var e,t,n,a=!0
if(E?C.length&&(a=!1,C=C.split(p)):(L.length&&(a=!1,L=L.split(p)),C.length&&(a=!1,E=!0,C=C.split(p))),!a)if(e=s(),E)for(n=0;n<e.length;n++)t=e[n],c(C,t.name)<0&&(u(t,"keydown",l),u(t,"keypress",i),y[t.name]=0)
else for(n=0;n<e.length;n++)t=e[n],c(L,t.name)>=0&&(u(t,"keydown",l),u(t,"keypress",i),y[t.name]=0)}function f(){n(),d()}function v(){function t(){if(!o){if(!h.body)return setTimeout(t,1)
o=!0,f()}}function n(){if(h.addEventListener)h.removeEventListener("DOMContentLoaded",n)
else{if(!h.attachEvent)return
h.detachEvent("onreadystatechange",n)}t()}function a(){if(!o){try{h.documentElement.doScroll("left")}catch(e){return setTimeout(a,1),void 0}t()}}function r(){var r=!1
if(!l){if(l=!0,"loading"!==h.readyState)return t(),void 0
if(h.addEventListener)h.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)
else if(h.attachEvent){h.attachEvent("onreadystatechange",n),h.attachEvent("onload",n)
try{r=!e.frameElement}catch(o){}h.documentElement.doScroll&&r&&a()}}}var o=!1,l=!1
r()}var h=e.document,g={},m={},p=":",y={},E=e.attachAll||!1,L=e.bedit_allow||[],C=e.bedit_deny||[]
v()}(window)

