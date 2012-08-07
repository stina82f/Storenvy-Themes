// requires jQuery 1.6.x  we're using .closest() (http://api.jquery.com/closest/)

!function( $ ){

  function tab(element, selector){
  
    // prepare variables
    var $tabs = $(selector)
      , $historyEndabledTabs = $tabs.filter('[data-history=true]');
 

    // tab functionality
    // expects an anchor tag that has an href linking it to an element with that ID. 
    function activate ( elm ) {

      if(window.console) window.console.log('activate', elm);

      $.each(elm, function(){
        
        var $this = $(this)
          , $parent = $this.closest($tabs)
          , href = $this.attr('href')
          , context = $parent.data('tabs') || $parent.data('pills')
          , $tab = $(href, context);

        // remove active from siblings
        $parent.children('li').removeClass('active');

        // add active to clicked tab
        $this.parent().addClass('active');

        // show appropriate tab content, hide the rest.
        $.fn.tabs.transition($this, $tab);
        // $tab.show().siblings().hide();
        
      });

    }

    
    // capture clicks on tab triggers
    // use .delegate() in the future?
    $tabs.find('> li > a').bind('click', function(){
      $this = $(this);
      
      if ($this.closest($tabs).filter('[data-history=true]').length) {
        // return true and let the hashchange functionality handle the tabbing and history...
        return true;
      }else{
        // trigger tabs functionality
        activate($this);
        return false;
      };                                                   
    });


    // Bind an event to window.onhashchange that, when the hash changes, gets the
    // hash and triggers the standard tab functionality.
    $(window).hashchange( function(){
      // find the appropriate anchor based on the hash. defaults to first list item.
      var hash = location.hash
        , target = $('[href='+hash+']', $historyEndabledTabs)
        , $trigger = (hash != '' && target.length) ? target : $('> li:first > a', $historyEndabledTabs);

      // trigger the tab functionality
      activate($trigger);

    });

    // Since the event is only triggered when the hash changes, we need to trigger
    // the event now, to handle the hash the page may have loaded with.
    // but only if there are history enabled tabs!
    if ($historyEndabledTabs.length) {
      $(window).hashchange();      
    };


    // load up the first tab in all non-history tab units
    activate($('> li:first > a', $tabs.not($historyEndabledTabs)));
    
    if (location.hash != '' && $('[href=' + location.hash + ']', $historyEndabledTabs).length != 0) {
      // activate any history-enabled tabs that do not contain the current hash
      activate($('> li:first > a', $historyEndabledTabs.not(':has([href=' + location.hash + '])') ));      
    };


  }
  
  
  /* TABS/PILLS PLUGIN DEFINITION
    * ============================ */


  $.fn.tabs = function ( selector ) {
    return this.each(function () {
      // $(this).delegate(selector || 'ul[data-tabs], ul[data-pills]', 'click', tab);
      tab(this, selector);
    })
  };
  
  // the transition between tab content
  // can be overridden by using a function like the one commented here 
  // $.fn.tabs.transition = function(trigger, content) {
  //   if(window.console) window.console.log('custom transition', elm, trigger);
  //   content.siblings().hide();
  //   content.fadeIn(1000);
  // }
  $.fn.tabs.transition = function(trigger, content){
    content.show().siblings().hide();
  };
  

  $(document).ready(function () {
    $('body').tabs('ul[data-tabs], ul[data-pills]');
  }); 
  


}( window.jQuery );