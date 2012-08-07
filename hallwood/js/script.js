(function(window,undefined){
  /**
      @namespace Holds functionality for app.
      @author Adrian Gyuricska
  */
  Hallwood = {
    isFirstRun: true,

    settings: {
      animSpeed: 500
    },

    common: {
      init: function(){
        log('Hallwood.common.init()');

        try{
          FB.XFBML.parse();
        }catch(ex){}

        if (Hallwood.isFirstRun) {
          Hallwood.common.firstRun();
          Hallwood.isFirstRun = false;
        };

      },
      firstRun: function(){
        log('Hallwood.common.firstRun()');

        // history.js
        Hallwood.historyConfig();
      }
    },

    home: {
      init: function(){
        log('Hallwood.home.init()');

      }
    },

    collection: {
      init: function(){
        log('Hallwood.collection.init()');

      }
    },

    product: {
      init: function(){
        log('Hallwood.details.init()');

        $('.product-gallery').cycle({
            fx:     'scrollHorz',
            timeout: 0,
            pager:  '.product-gallery-nav'
        });
      }
    },

    historyConfig: function(){
      log('Hallwood.historyConfig()');

      //  make sure this function only runs once. bad things happen otherwise...
      // Hallwood.historyConfigured = true;

      // https://github.com/balupton/History.js
      // https://gist.github.com/854622/adf32aa832486292763d7ce0de460d06e85c642e
      var
        History = window.History,
        $ = window.jQuery,
        document = window.document;

      // Check to see if History.js is enabled for our Browser
      if ( !History.enabled ) {
        return false;
      }

      // Wait for Document
      // $(function(){
        var
          /* Application Specific Variables */
          contentSelector = '#content',
          $content = $(contentSelector).filter(':first'),
          contentNode = $content.get(0),
          $menu = $('nav:first, #filters:first'), //.filter(':first'),
          activeClass = 'current active selected',
          activeSelector = '.current,.active,.selected',
          menuChildrenSelector = '> ul > li,> li',
          /* Application Generic Variables */
          $body = $(document.body),
          rootUrl = History.getRootUrl(),
          scrollOptions = {
            duration: Hallwood.settings.animSpeed,
            easing:'swing'
          };

        // Ensure Content
        if ( $content.length === 0 ) {
          $content = $body;
        }

        // Internal Helper
        $.expr[':'].internal = function(obj, index, meta, stack){
          // Prepare
          var
            $this = $(obj),
            url = $this.attr('href')||'',
            isInternalLink;

          // Check link
          isInternalLink = url.substring(0,rootUrl.length) === rootUrl || (/[^\:]/).test(url);

          // Ignore or Keep
          return isInternalLink;
        };

        // HTML Helper
        var documentHtml = function(html){
          // Prepare
          var result = String(html)
            .replace(/<\!DOCTYPE[^>]*>/i, '')
            .replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
            .replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
          ;

          // Return
          return result;
        };

        // Ajaxify Helper
        $.fn.ajaxify = function(){
          // Prepare
          var $this = $(this);

          // Ajaxify
          $this.find('a:internal:not(.view):not(.no-ajaxy)').click(function(event){
            // Prepare
            var
              $this = $(this),
              url = $this.attr('href'),
              title = $this.attr('title')||null;

            // Continue as normal for cmd clicks etc
            if ( event.which == 2 || event.metaKey ) { return true; }

            // Ajaxify this link
            History.pushState(null,title,url);
            event.preventDefault();
            return false;
          });

          // Chain
          return $this;
        };

        // Ajaxify our Internal Links
        $body.ajaxify();

        // Hook into State Changes
        $(window).bind('statechange',function(){
          // Prepare Variables
          var
            State = History.getState(),
            url = State.url,
            relativeUrl = url.replace(rootUrl,'');

          // Set Loading
          $body.addClass('loading');

          // Start Fade Out
          // Animating to opacity to 0 still keeps the element's height intact
          // Which prevents that annoying pop bang issue when loading in new content
          $content.animate({opacity:0},Hallwood.settings.animSpeed);

          // Ajax Request the Traditional Page
          $.ajax({
            url: url,
            success: function(data, textStatus, jqXHR){
              // Prepare
              var
                $data = $(documentHtml(data)),
                $dataBody = $data.find('.document-body:first'),
                $dataContent = $dataBody.find(contentSelector).filter(':first'),
                $menuChildren, contentHtml, $scripts;

              // Fetch the scripts
              $scripts = $dataContent.find('.document-script');
              if ( $scripts.length ) {
                $scripts.detach();
              }

              // Fetch the content
              contentHtml = $dataContent.html()||$data.html();
              if ( !contentHtml ) {
                document.location.href = url;
                return false;
              }

              // Update the menu
              $menuChildren = $menu.find(menuChildrenSelector);
              $menuChildren.filter(activeSelector).removeClass(activeClass);
              $menuChildren = $menuChildren.has('a[href^="'+relativeUrl+'"],a[href^="/'+relativeUrl+'"],a[href^="'+url+'"]');
              if ( $menuChildren.length === 1 ) { $menuChildren.addClass(activeClass); }

              log($menuChildren, relativeUrl, url);


              // Update the content
              $content.stop(true,true);
              // $content.html(contentHtml).ajaxify().css('opacity',100).show(); /* you could fade in here if you'd like */
              $content.html(contentHtml).ajaxify().animate({opacity:1},Hallwood.settings.animSpeed);

              // Update the title
              document.title = $data.find('.document-title:first').text();
              try {
                document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
              }
              catch ( Exception ) { }

              // Add the scripts
              $scripts.each(function(){
                var $script = $(this), scriptText = $script.html(), scriptNode = document.createElement('script');
                scriptNode.appendChild(document.createTextNode(scriptText));
                contentNode.appendChild(scriptNode);
              });

              // Complete the change
              if ( $body.ScrollTo||false ) { $body.ScrollTo(scrollOptions); } /* http://balupton.com/projects/jquery-scrollto */
              $body.removeClass('loading');

              //  fire page specific javascript
              document.body.setAttribute( "data-controller",  $dataBody.data('controller'));
              document.body.setAttribute( "data-action",  $dataBody.data('action'));
              document.body.setAttribute( "data-bg",  $dataBody.data('bg'));
              UTIL.init();

              // Inform Google Analytics of the change
              if ( typeof window.pageTracker !== 'undefined' ) {
                window.pageTracker._trackPageview(relativeUrl);
              }

              // Inform ReInvigorate of a state change
              // if ( typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined' ) {
              //                   reinvigorate.ajax_track(url);
              //                   // ^ we use the full url here as that is what reinvigorate supports
              //                 }


            },
            error: function(jqXHR, textStatus, errorThrown){
              document.location.href = url;
              return false;
            }
          }); // end ajax

        }); // end onStateChange

      // }); // end onDomLoad

    }
  }; // end Hallwood literal


  /**
      @namespace Utility object that powers the execution of specific functions in the Hallwood namespace based on data attributes on the <body> tag.
      @see Based on <a href="http://www.viget.com/inspire/extending-paul-irishs-comprehensive-dom-ready-execution/">this</a>, which is based on <a href="http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/">this</a>
  */
  UTIL = {
    exec: function( controller, action ) {
      var ns = Hallwood,
          action = ( action === undefined ) ? "init" : action;

      if ( controller !== "" && ns[controller] && typeof ns[controller][action] == "function" ) {
        ns[controller][action]();
      }
    },

    /** This should be called once DOM is ready to kick everything off. */
    init: function() {
      var body = document.body,
          controller = body.getAttribute( "data-controller" ),
          action = body.getAttribute( "data-action" );

      $('body').attr('class','').addClass(controller);

      if(window.console) window.console.log('in UTIL.init():', controller, action);

      UTIL.exec( "common" );
      UTIL.exec( controller );
      UTIL.exec( controller, action );
    }
  };

  // kick it all off
  $( document ).ready( UTIL.init );

})(window); // end closure