(function(e,t){Storenvy={isFirstRun:!0,settings:{animSpeed:500},common:{init:function(){log("Storenvy.common.init()");if(Storenvy.isFirstRun){Storenvy.common.firstRun();Storenvy.isFirstRun=!1}},firstRun:function(){log("Storenvy.common.firstRun()");Storenvy.historyConfig()}},home:{init:function(){log("Storenvy.home.init()")}},collection:{init:function(){log("Storenvy.collection.init()")}},product:{init:function(){log("Hallwood.details.init()");$(".product-gallery").cycle({fx:"scrollHorz",timeout:0,pager:".product-gallery-nav"})}},historyConfig:function(){log("Storenvy.historyConfig()");var t=e.History,n=e.jQuery,r=e.document;if(!t.enabled)return!1;var i="#content",s=n(i).filter(":first"),o=s.get(0),u=n("nav:first, #filters:first"),a="current active selected",f=".current,.active,.selected",l="> ul > li,> li",c=n(r.body),h=t.getRootUrl(),p={duration:Storenvy.settings.animSpeed,easing:"swing"};s.length===0&&(s=c);n.expr[":"].internal=function(e,t,r,i){var s=n(e),o=s.attr("href")||"",u;u=o.substring(0,h.length)===h||/[^\:]/.test(o);return u};var d=function(e){var t=String(e).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2').replace(/<\/(html|head|body|title|meta|script)\>/gi,"</div>");return t};n.fn.ajaxify=function(){var e=n(this);e.find("a:internal:not(.view):not(.no-ajaxy)").click(function(e){var r=n(this),i=r.attr("href"),s=r.attr("title")||null;if(e.which==2||e.metaKey)return!0;t.pushState(null,s,i);e.preventDefault();return!1});return e};c.ajaxify();n(e).bind("statechange",function(){var v=t.getState(),m=v.url,g=m.replace(h,"");c.addClass("loading");s.animate({opacity:0},Storenvy.settings.animSpeed);n.ajax({url:m,success:function(t,h,v){var y=n(d(t)),b=y.find(".document-body:first"),w=b.find(i).filter(":first"),E,S,x;x=w.find(".document-script");x.length&&x.detach();S=w.html()||y.html();if(!S){r.location.href=m;return!1}E=u.find(l);E.filter(f).removeClass(a);E=E.has('a[href^="'+g+'"],a[href^="/'+g+'"],a[href^="'+m+'"]');E.length===1&&E.addClass(a);log(E,g,m);s.stop(!0,!0);s.html(S).ajaxify().animate({opacity:1},Storenvy.settings.animSpeed);r.title=y.find(".document-title:first").text();try{r.getElementsByTagName("title")[0].innerHTML=r.title.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(T){}x.each(function(){var e=n(this),t=e.html(),i=r.createElement("script");i.appendChild(r.createTextNode(t));o.appendChild(i)});(c.ScrollTo||!1)&&c.ScrollTo(p);c.removeClass("loading");r.body.setAttribute("data-controller",b.data("controller"));r.body.setAttribute("data-action",b.data("action"));r.body.setAttribute("data-bg",b.data("bg"));UTIL.init();typeof e.pageTracker!="undefined"&&e.pageTracker._trackPageview(g)},error:function(e,t,n){r.location.href=m;return!1}})})}};UTIL={exec:function(e,n){var r=Storenvy,n=n===t?"init":n;e!==""&&r[e]&&typeof r[e][n]=="function"&&r[e][n]()},init:function(){var t=document.body,n=t.getAttribute("data-controller"),r=t.getAttribute("data-action");$("body").attr("class","").addClass(n);e.console&&e.console.log("in UTIL.init():",n,r);UTIL.exec("common");UTIL.exec(n);UTIL.exec(n,r)}};$(document).ready(UTIL.init)})(window);