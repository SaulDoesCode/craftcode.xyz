/** @license MIT
 *  @overview Crafter.js , minimalist front-end library
 *  @author Saul van der Walt - https://github.com/SaulDoesCode/
 *   /[^{}]+(?=\})/g    find between curly braces
 */
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var n=0,t=Array(e.length);n<e.length;n++)t[n]=e[n];return t}return Array.from(e)}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _typeof(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();!function(e,n){var t=function(e,n){return toString.call(e)===n},r=function(e,n){return("undefined"==typeof e?"undefined":_typeof(e))===n},o=function(e,n){return!r(e,n)},u=!1,a=e.getElementsByTagName("head")[0],c=e.createElement("style"),s=navigator.userAgent,f=void 0,l=s.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);l&&null!==(f=s.match(/version\/([\.\d]+)/i))&&(l[2]=f[1]),l?[l[1],l[2]]:[navigator.appName,navigator.appVersion,"-?"],n.CurrentBrowser={is:function(e){return CurrentBrowser.browser.toLowerCase().includes(e.toLowerCase())?!0:!1},browser:l.join(" ")},c.setAttribute("crafterstyles",""),c.innerHTML="\n@keyframes NodeInserted {from {opacity:.99;}to {opacity: 1;}}[view-bind] {animation-duration: 0.001s;animation-name: NodeInserted;}",a.appendChild(c),c=e.querySelector("[crafterstyles]",a),n.is={Bool:function(e){return"boolean"==typeof e},Arr:function(e){return Array.isArray(e)},Arraylike:function(e){return"length"in e&&e!==window&&!is.Func(e)&&is.Num(e.length)?!0:!1},String:function(e){return r(e,"string")},Num:function(e){return r(e,"number")},Undef:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];return n.every(function(e){return r(e,"undefined")})},Def:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];return n.every(function(e){return o(e,"undefined")})},Null:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];return n.every(function(e){return null===e})},Node:function(e){function n(){return e.apply(this,arguments)}return n.toString=function(){return e.toString()},n}(function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];return n.every(function(e){return e instanceof Node})}),NodeList:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];for(var r=0;r<n.length;r++)if(Array.from(n[r]).every(function(e){return is.Node(e)}))return!0;return!1},Object:function(){for(var e=arguments.length,n=Array(e),r=0;e>r;r++)n[r]=arguments[r];return n.every(function(e){return t(e,"[object Object]")})},Element:function(){for(var e=arguments.length,n=Array(e),r=0;e>r;r++)n[r]=arguments[r];return n.every(function(e){return t(e,"[object HTMLElement]")})},File:function(){for(var e=arguments.length,n=Array(e),r=0;e>r;r++)n[r]=arguments[r];return n.every(function(e){return t(e,"[object File]")})},FormData:function(){for(var e=arguments.length,n=Array(e),r=0;e>r;r++)n[r]=arguments[r];return n.every(function(e){return t(e,"[object FormData]")})},Map:function(){for(var e=arguments.length,n=Array(e),r=0;e>r;r++)n[r]=arguments[r];return n.every(function(e){return t(e,"[object Map]")})},Func:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];return n.every(function(e){return"function"==typeof e})},Blob:function(e){return t(e,"[object Blob]")},RegExp:function(e){return t(e,"[object RegExp]")},Date:function(e){return t(e,"[object Date]")},Set:function(e){return t(e,"[object Set]")},Symbol:function(e){return t(e,"[object Symbol]")},UpperCase:function(e){return e>="A"&&"Z">=e},Email:function(e){return/(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(e)},Between:function(e,n,t){return n>=e&&e>=t},lt:function(e,n){return n>e},lte:function(e,n){return n>=e},bt:function(e,n){return e>n},bte:function(e,n){return e>=n},Native:function(e){var n="undefined"==typeof e?"undefined":_typeof(e);return"function"===n?RegExp("^"+String(Object.prototype.toString).replace(/[.*+?^${}()|[\]\/\\]/g,"\\$&").replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$").test(Function.prototype.toString.call(e)):e&&"object"==n&&/^\[object .+?Constructor\]$/.test(e.toString)||!1}},n.forEach=function(e,n){if(!is.Func(n))throw new Error("forEach : invalid or undefined function provided");var t=0;if(is.Object(e))for(t in e)e.hasOwnProperty(t)&&n(e[t],t);else for(;t<e.length;t++)n(e[t],t)},n.QueryOrNodetoNodeArray=function(e){return is.String(e)&&(e=queryAll(e)),is.Null(e)?null:is.Node(e)?[e]:is.NodeList(e)?Array.from(e):void 0},n.query=function(n,t){return is.String(t)?e.querySelector(t).querySelector(n):is.Node(t)?t.querySelector(n):e.querySelector(n)},n.queryAll=function(n,t){return is.String(t)?e.querySelector(t).querySelectorAll(n):is.Node(t)?t.querySelectorAll(n):e.querySelectorAll(n)},n.queryEach=function(n,t,r){is.Func(t)&&(r=t,t=e);var o=void 0;is.String(t)&&(o=e.querySelector(t).querySelectorAll(n)),o=t.querySelectorAll(n);for(var i=0;i<o.length;i++)r(o[i],i)},n.log=function(e,n){switch(e){case"err":console.error(n);break;case"warn":console.warn(n);break;case"success":console.log("%c"+n,"color:green;");break;case"info":console.info(n);break;default:console.log(e)}},n.EventHandler=function(){function e(n,t,r){var o=this;_classCallCheck(this,e),this.EventType=n,this.Func=r,this.Target=t!==window&&t!==document?QueryOrNodetoNodeArray(t):t,this.FuncWrapper=function(e){return r.apply(void 0,[e,e.srcElement].concat(_toConsumableArray(o.args||[])))}}return _createClass(e,[{key:"On",value:function(){var e=this;is.Arr(this.Target)?this.Target.forEach(function(n){return n.addEventListener(e.EventType,e.FuncWrapper)}):this.Target.addEventListener(this.EventType,this.FuncWrapper)}},{key:"Off",value:function(){var e=this;is.Arr(this.Target)?this.Target.forEach(function(n){return n.removeEventListener(e.EventType,e.FuncWrapper)}):this.Target.removeEventListener(this.EventType,this.FuncWrapper)}},{key:"Once",value:function(){var e=this.FuncWrapper,n=this.Target,t=this.EventType,r=function o(r){e(r),is.Arr(n)?n.forEach(function(e){return e.removeEventListener(t,o)}):n.removeEventListener(t,o)};is.Arr(n)?n.forEach(function(e){return e.addEventListener(t,r)}):n.addEventListener(t,r)}}]),e}(),n.On=function(e,n,t){is.Func(n)&&(t=n,n=window);var r=new EventHandler(e,n,t);return r.On(),r},n.Once=function(e,n,t){is.Func(n)&&(t=n,n=window);var r=new EventHandler(e,n,t);return r.Once(),r},n.make_element=function(n,t,r,o){if(is.Bool(r)&&(o=r,r=void 0),o===!0){var i=function(){var o=e.createElement(n);return is.String(t)&&(o.innerHTML=t),is.Def(r)&&(is.Object(r)&&forEach(r,function(e,n){return o.setAttribute(n,e)}),is.String(r)&&o.setAttribute(r,"")),{v:o}}();if("object"===("undefined"==typeof i?"undefined":_typeof(i)))return i.v}else{if(is.Def(r)&&is.String(r))return"<"+n+" "+r+">"+t+"</"+n+">";var u=function(){var e="";return is.Def(r)&&is.Object(r)&&forEach(r,function(n,t){return e+=" "+t+'="'+n+'" '}),{v:"<"+n+" "+e+">"+t+"</"+n+">"}}();if("object"===("undefined"==typeof u?"undefined":_typeof(u)))return u.v}},n.dom=function(e){if(is.String(e)){var n=queryAll(e);e=n.length>1?n:n[0]}return is.Node(e)?{html:function(n){return n?e.innerHTML=n:e.innerHTML},text:function(n){return n?e.textContent=n:e.textContent},replace:function(n){return e.parentNode.replaceChild(el,e)},remove:function(){return e.parentNode.removeChild(e)},appendTo:function(n){var t=void 0;t=is.Node(n)?n:query(n),null!==t&&t.appendChild(e)},append:function(n){return is.String(n)?e.innerHTML+=n:e.appendChild(e)},prepend:function(n){return is.String(n)?e.innerHTML=n+e.innerHTML:e.insertBefore(n,e.firstChild)},On:function(e){function n(n,t){return e.apply(this,arguments)}return n.toString=function(){return e.toString()},n}(function(n,t){return On(n,e,t)}),css:function(n){return is.Def(n)?forEach(n,function(n,t){return e.style[t]=n}):console.error("Styles Object undefined")},getSiblings:function(){for(var n=[],t=e.parentNode.childNodes,r=0;r<t.length;r++)t[r]!==e&&n.push(t[r]);return n},Width:function(){return e.getBoundingClientRect().width},Height:function(){return e.getBoundingClientRect().height},getRect:function(){return e.getBoundingClientRect()},setWidth:function(n){return e.style.width=n},setHeight:function(n){return e.style.height=n},find:function(n,t,r){var o=queryAll(n,e);return o.length>1||t===!0&&!is.Null(o)?o:is.Null(o)?null:o[0]}}:is.NodeList(e)?{On:function(e){function n(n,t){return e.apply(this,arguments)}return n.toString=function(){return e.toString()},n}(function(n,t){return On(n,e,t)}),find:function(n,t,r){var o=queryAll(n,e);return o.length>1||t===!0&&!is.Null(o)?o:is.Null(o)?null:o[0]},includes:function(n){is.Node(n)||(n=query(n));for(var t=0;t<e.length;t++)if(e[t]===n)return!0;return!1},css:function(n){return is.Def(n)?forEach(e,function(e){return forEach(n,function(n,t){return e.style[t]=n})}):console.error("styles unefined")}}:{div:function(e,n){return make_element("div",e,n)},span:function(e,n){return make_element("span",e,n)},label:function(e,n){return make_element("label",e,n)}}},n.Craft={ArraytoObject:function(e){var n={};for(var t in e)is.Def(e[t])&&(n[t]=e[t]);return n},toArray:function(e){return slice.call(e)},IndexOfArrayInArray:function(e,n){for(var t=0;t<n.length;t++)if(e[0]===n[t])for(var r=0;r<e.length&&e[r]===n[t+r];r++)if(r==e.length-1)return t;return-1},loader:{pre:"craft:",CraftImport:function(e){var n=+new Date,t=e.key||e.url,r=Craft.loader.get(t);return r||r.expire-n>0?new Promise(function(e){return e(r)}):new Promise(function(r,o){return fetch(e.url).then(function(o){return o.text().then(function(o){e.data=o,e.stamp=n,e.expire=n+60*(e.expire||4e3)*60*1e3,e.cache&&localStorage.setItem(Craft.loader.pre+t,JSON.stringify(e)),r(e)})})["catch"](function(e){return o("Craft.loader: problem fetching import -> "+e)})})},Import:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];var r=void 0,o=[];return n.forEach(function(e){r={url:e.css||e.script,type:e.css?"css":"script",exec:e.execute!==!1,cache:e.cache!==!1},is.Def(e.key)&&(r.key=e.key),is.Def(e.defer)&&(r.defer=e.defer),is.Def(e.expire)&&(r.expire=e.expire),e.test===!1?Craft.loader.remove(r.url):o.push(Craft.loader.CraftImport(r))}),Promise.all(o).then(function(e){return e.map(function(e){if("css"===e.type)c.innerHTML+=" \n"+e.data;else{var n=make_element("script",e.data,{type:"text/javascript"},!0);n.defer=e.defer||void 0,e.exec&&a.appendChild(n)}})})},setPrekey:function(e){return Craft.loader.pre=e+":"},get:function(e){return JSON.parse(localStorage.getItem(e.includes(Craft.loader.pre)?e:Craft.loader.pre+e)||!1)},remove:function(e){return localStorage.removeItem(e.includes(Craft.loader.pre)?e:Craft.loader.pre+e)},removeAll:function(e){for(var n in localStorage)(!e||Craft.loader.get(n).expire<=+new Date)&&Craft.loader.remove(n)}},Router:{handle:function(e,n){(location.hash===e||location===e)&&n(),Craft.router.handlers.push({link:e,func:n})},handlers:[],links:[],makeLink:function(e,n,t,r){return Craft.router.links.push(function(){return On(is.Undef(r)?"click":r,query(e),function(e){return Craft.router.open(n,t)})})},open:function(e){function n(n,t){return e.apply(this,arguments)}return n.toString=function(){return e.toString()},n}(function(e,n){return n?open(e):location=e}),setTitle:function(e){return document.title=e},setView:function(e,n){return query(e).innerHTML=n},fetchView:function(e,n,t,r){is.Null(localStorage.getItem("RT_"+r))?fetch(n).then(function(n){n.text().then(function(n){t&&is.Def(r)&&is.String(r)&&is.Null(localStorage.getItem("RT_"+r))&&localStorage.setItem("RT_"+r,n),query(e).innerHTML=n})})["catch"](function(e){return log("warn","Could not fetch view -> "+e)}):t&&(query(e).innerHTML=localStorage.getItem("RT_"+r))},clearCache:function(){for(var e in localStorage)localStorage.key(e).includes("RT_")&&localStorage.removeItem(localStorage.key(e))}},Cookies:{get:function(n){return n?decodeURIComponent(e.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(n).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null:null},set:function(n,t,r,o,i,u){if(!n||/^(?:expires|max\-age|path|domain|secure)$/i.test(n))return!1;var a="";return r&&(is.Num(r)&&(a=r===1/0?"; expires=Fri, 11 April 9997 23:59:59 UTC":"; max-age="+r),is.String(r)&&(a="; expires="+r),is.Date(r)&&(a="; expires="+r.toUTCString())),e.cookie=encodeURIComponent(n)+"="+encodeURIComponent(t)+a+(i?"; domain="+i:"")+(o?"; path="+o:"")+(u?"; secure":""),!0},remove:function(n,t,r){return Craft.Cookies.has(n)?(e.cookie=encodeURIComponent(n)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(r?"; domain="+r:"")+(t?"; path="+t:""),!0):!1},has:function(n){return n?new RegExp("(?:^|;\\s*)"+encodeURIComponent(n).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(e.cookie):!1},keys:function(){for(var n=e.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),t=0;t<n.length;t++)n[t]=decodeURIComponent(n[t]);return n}},trim:function(e){return is.Null(e)?"":(e+"").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")},after:function(e,n){var t=this;if(!is.Func(n))if(is.Func(e)){var r=e;e=n,n=r}else log("err","after : func is not a function");return e=Number.isFinite(e=+e)?e:0,function(){for(var r=arguments.length,o=Array(r),i=0;r>i;i++)o[i]=arguments[i];return--e<1?n.apply(t,o):void 0}},debounce:function(e,n,t){var r=void 0;return function(){var o=this,i=arguments,u=function(){r=null,t||n.apply(o,i)},a=t&&!r;clearTimeout(r),r=setTimeout(u,e),a&&n.apply(o,i)}},throttle:function(e,n,t){var r=void 0,o=void 0,i=void 0,u=null,a=0;t||(t={});var c=function(){a=t.leading===!1?0:Date.now(),u=null,i=n.apply(r,o),u||(r=o=null)};return function(){var s=Date.now();a||t.leading!==!1||(a=s);var f=e-(s-a);return r=this,o=arguments,0>=f||f>e?(u&&(clearTimeout(u),u=null),a=s,i=n.apply(r,o),u||(r=o=null)):u||t.trailing===!1||(u=setTimeout(c,f)),i}},once:function(e,n){var t=void 0;return function(){return is.Func(e)&&(t=e.apply(n||this,arguments),e=null),t}},css:function(e,n){return is.Def(n,e)&&is.Node(e)?forEach(n,function(n,t){return e.style[t]=n}):log("err","invalid args")},hasCapitals:function(e){for(var n=0;n<e.length;n++)if(is.UpperCase(e[n]))return!0;return!1},OverrideFunction:function(e,n,t){for(var r=e.split("."),o=r.pop(),i=0;i<r.length;i++)t=t[r[i]];t[o]=n},concatObjects:function(e){for(var n=arguments.length,t=Array(n>1?n-1:0),r=1;n>r;r++)t[r-1]=arguments[r];return forEach(e,function(){t.forEach(function(n){forEach(n,function(n,t){t in e?is.Arr(e[t])?e[t].includes(n)||e[t].push(n):n!==e[t]&&(e[t]=[n,e[t]]):e[t]=n})})}),e},mergeObjects:function(e){for(var n=arguments.length,t=Array(n>1?n-1:0),r=1;n>r;r++)t[r-1]=arguments[r];return Object.assign(e,t)},len:function(e){if(is.Object(e))return Object.keys(e).length;if(is.Map(e)||is.Set(e))return e.size;try{return e.length}catch(n){console.error("could not find length of value")}},type:function(){for(var e=arguments.length,n=Array(e),t=0;e>t;t++)n[t]=arguments[t];var r=[];return n.forEach(function(e){return r.push("undefined"==typeof e?"undefined":_typeof(e))}),r.length<2?r[0]:r},indexOfDate:function(e,n){for(var t=0;t<e.length;t++)if(+e[t]===+n)return t;return-1},removeArrItem:function(e,n){var t=e.IndexOf(n),r=[],o=!1,i=0;for(is.String(e)&&(e=Array.from(e),o=!0);i<e.length;i++)i!==t&&r.push(e[i]);return o?r:r},omit:function(e,n){return is.Object(e)?(e!==n&&forEach(e,function(t,r){(n===r||n===t)&&delete e[r]}),e.hasOwnProperty(n)&&log("err","couldn't omit "+n+"from Object")):(is.Arr(e)||is.String(e))&&(e.forEach(function(t){n===t&&(e=Craft.removeArrItem(e,t))}),-1!==n.IndexOf(i)&&console.error("couldn't omit "+n+" from Array or String")),e},Scope:{},WebComponents:[],mouse:{x:0,y:0,over:null},nodeExists:function(e,n){return null!==queryAll(e,n=is.Node(n)?n:query(n))},ObjToFormData:function(e){var n=new FormData,t=void 0;for(t in e)n.append(t,e[t]);return n},URLfrom:function(e){return URL.createObjectURL(new Blob([e]))},OnScroll:function(e,n){var t=!1;is.Func(n)?On(e,function(e){t=e.deltaY<1?!1:!0,n(t,e)}):console.error("second param needs to be a function")},OnResize:function(e){return is.Func(e)?Craft.ResizeHandlers.add(e):cerr("TypeError : Craft.OnResize -> func is not a function")},poll:function(e,n,t,r,o){return function(){is.Func(t)&&(is.Func(r)&&(o=r),r=t,t=void 0);var i=setInterval(function(){(is.Bool(e)&&e===!0||is.Func(e)&&e()===!0)&&(r(),clearInterval(i))},n||20);is.Num(t)&&setTimeout(function(){clearInterval(i),(is.Bool(e)&&e===!1||is.Func(e)&&e()===!1)&&o()},t)}()},randomString:function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)},GenUID:function(){return Craft.randomString()+Craft.randomString()+"-"+Craft.randomString()+"-"+Craft.randomString()+"-"+Craft.randomString()+"-"+Craft.randomString()+Craft.randomString()+Craft.randomString()},createWebComponent:function(e){is.String&&(e=JSON.parse(e)),c.innerHTML+=e.css;var n=make_element("script","",{src:Craft.URLfrom(e.js),type:"text/javascript",webcomponent:e.name},!0);n.setAttribute("webcomponent",e.name),n.onload=function(n){return Craft.WebComponents.push(e.name)},a.appendChild(n)},newComponent:function(n,t){is.Undef(t)?console.error("Invalid Component Configuration"):!function(){var r=Object.create(HTMLElement.prototype);forEach(t,function(e,n){"created"===n?r.createdCallback=e:"inserted"===n?r.attachedCallback=e:"destroyed"===n?r.detachedCallback=e:"attr"===n?r.attributeChangedCallback=e:is.Func(e)?r[n]=e:"extends"===n||is.Func(e)||(r[n]=e)}),"extends"in t?e.registerElement(n,{prototype:r,"extends":t["extends"]}):e.registerElement(n,{prototype:r})}()}},Craft.loader.removeAll(!0),n.FunctionIterator=function(){function e(){_classCallCheck(this,e),this.functions={},this.length=Object.keys(this.functions).length}return _createClass(e,[{key:"has",value:function(e){return this.functions.has(e)?!0:!1}},{key:"add",value:function(e,n){is.Func(n)?this.functions[e]=n:is.Func(e)?this.functions[Craft.randomString()]=e:log("err","Invalid function parameter in FunctionIterator.add(funcName , _function_ )"),this.length=Object.keys(this.functions).length}},{key:"remove",value:function(e){this.functions.has(e)?(this.functions[e]=null,delete this.functions[e]):log("warn","No Such Function Entry in FunctionIterator"),this.length=Object.keys(this.functions).length}},{key:"removeAll",value:function(){delete this.functions,this.functions=null,this.functions={},this.length=Object.keys(this.functions).length}},{key:"runEach",value:function(){for(var e in this.functions)this.functions[e].apply(this,arguments)}},{key:"runOne",value:function(e,n){this.functions.hasOwnProperty(e)?this.functions[e].apply(this,n,arguments):log("warn","No Such Function Entry in FunctionIterator")}}]),e}(),n.ReactiveVariable=function(){function e(n,t){return _classCallCheck(this,e),is.Func(t)?(this.val=n,this.Handle=t):log("err","ReactiveVariable needs a handler function after the value"),this.val}return _createClass(e,[{key:"set",value:function(e){return this.val!==e&&(this.Oldval=this.val,this.val=e,this.Handle(this.Oldval,e)),this.val}},{key:"get",value:function(){return this.val}},{key:"reset",value:function(e){is.Func(e)?this.Handle=e:log("err","ReactiveVariable.Reset only takes a function")}}]),e}(),Craft.Binds=new Map,Craft.newBind=function(e,n,t){is.Func(t)?Craft.Binds.set(e,new ReactiveVariable(n,t)):Craft.Binds.set(e,n),queryEach("[view-bind]",function(e){Craft.Binds.has(e.getAttribute("view-bind"))&&(e.innerHTML=is.Func(t)?Craft.Binds.get(e.getAttribute("view-bind")).get():Craft.Binds.get(e.getAttribute("view-bind")))})},Craft.setBind=function(e,n){Craft.Binds.get(e).set(n),queryEach("[view-bind]",function(e){Craft.Binds.has(e.getAttribute("view-bind"))&&(e.innerHTML=Craft.Binds.get(e.getAttribute("view-bind")).get())})},On("animationstart",document,function(e){"NodeInserted"===e.animationName&&is.Node(e.target)&&e.target.hasAttribute("[view-bind]")&&Craft.Binds.has(e.target.getAttribute("view-bind"))&&(e.target.innerHTML=Craft.Binds.get(e.target.getAttribute("view-bind")).get())}),Craft.ResizeHandlers=new FunctionIterator,n.onresize=Craft.throttle(450,function(e){return Craft.ResizeHandlers.runEach(e)}),n.onmousemove=function(e){Craft.mouse.x=e.clientX,Craft.mouse.y=e.clientY,Craft.mouse.over=e.target},Craft.newComponent("fetch-webcomponent",{created:function(){var e=this;if(this.hasAttribute("src")){var n=null;this.hasAttribute("cache-component")&&"true"===this.getAttribute("cache-component")&&(n=localStorage.getItem(this.getAttribute("src")),null!==n&&!function(){var e=JSON.parse(n);c.innerHTML+=e.css;var t=make_element("script","",{src:Craft.URLfrom(e.js),type:"text/javascript",webcomponent:e.name},!0);t.setAttribute("webcomponent",e.name),t.onload=function(n){return Craft.WebComponents.push(e.name)},a.appendChild(t)}()),null===n&&fetch(this.getAttribute("src")).then(function(n){n.json().then(function(n){c.innerHTML+=n.css;var t=make_element("script","",{src:Craft.URLfrom(n.js),type:"text/javascript",webcomponent:n.name},!0);t.onload=function(e){Craft.WebComponents.push(n.name),t=null,n=null},a.appendChild(t),e.hasAttribute("cache-component")&&"true"===e.getAttribute("cache-component")&&localStorage.setItem(e.getAttribute("src"),JSON.stringify(n))})})["catch"](function(e){return console.error(e+": could not load webcomponent")})}}}),Once("DOMContentLoaded",function(){queryEach("[link]",function(e){return On("click",e,function(n){return e.hasAttribute("newtab")?open(e.getAttribute("link")):Craft.Router.open(e.getAttribute("link"))})}),Craft.Router.links.forEach(function(e){return e()}),Craft.WebComponents.length===queryAll("fetch-webcomponent").length?u=!0:Craft.poll(function(){return Craft.WebComponents.length===queryAll("fetch-webcomponent").length},35,2e3,function(){return u=!0},function(){console.log("loading is taking longer than usual :("),u=!0})}),Craft.WhenReady=function(e){return new Promise(function(n,t){var r=CurrentBrowser.is("Firefox")||CurrentBrowser.is("msie");e=e||Craft.Scope,u?r?setTimeout(function(){return n(e)},500):n(e):!function(){var o=setInterval(function(){u&&(r?setTimeout(function(){return n(e)},500):n(e),clearInterval(o))},20);setTimeout(function(){clearInterval(o),u||t("Things didn't load correctly/intime -> load failed")},4500)}()})},On("hashchange",function(e){return CraftRouter.handlers.forEach(function(e){return location.hash===e.link||location===e.link?e.func():null})})}(document,self);