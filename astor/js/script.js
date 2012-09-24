function bannerResize(){
  if($('.banner').length){
    var brandingHeight = $('.branding').height();
    $('.hidden').css('margin-top', -brandingHeight-5);
  }
}

SITE = {
  common: {
    init: function(){
      if(window.console) window.console.log('common.init()');

      bannerResize();
      $(window).resize(function(){
        bannerResize();
      });

      if($('.block-grid').length && $(window).width() > 767 ) {
        $('.block-grid li').each(function(){
          $(this).find('img').load(function(){
            var height = $(this).height();
            $(this).parents('.product').find('.product-center').css({'height':height});
          });
        })
      }
    }
  },
  home: {
    init: function(){
      if(window.console) window.console.log('bodyClass.home()');

    }
  },

  collection: {
    init: function(){
      if(window.console) window.console.log('bodyClass.home()');

    }
  },

  product: {
    init: function(){
      if(window.console) window.console.log('bodyClass.home()');

      $('.product-gallery').cycle({
          fx:     'fade',
          timeout: 0,
          pager:  '.product-gallery-nav',
          slideResize: true,
          containerResize: false,
          width: '100%',
          fit: 1
      });
    }
  }
};

// http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
UTIL = {

  fire : function(func,funcname, args){

    var namespace = SITE;  // indicate your obj literal namespace here

    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    }

  },

  loadEvents : function(){

    var bodyId = document.body.id;

    // hit up common first.
    UTIL.fire('common');

    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
      UTIL.fire(classnm,bodyId);
    });

    UTIL.fire('common','finalize');

  }

};

// kick it all off here
$(document).ready(UTIL.loadEvents);