/*!
 * jQuery Dropdown Plugin
 * Copyright (c) 2010 Eli Dupuis
 * Version: 0.3 (Sept 1, 2010)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://creativecommons.org/licenses/GPL/2.0/) licenses.
 * Requires: jQuery v1.4.2 or later
 * Based heavily on snippet from (Steve Taylor) http://sltaylor.co.uk/blog/jquery-hover-drop-down-menu-settimeout/
 */

(function($) {

var ver = '0.3';

$.fn.dropdown = function(options) {

	// build main options before element iteration
	var opts = $.extend({}, $.fn.dropdown.defaults, options),
	    navTimers = []; 

	return this.each(function() {
		$this = $(this);
		// build element specific options
		var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

        if (opts.mozRemoveTitleAttr) {
    		//	start firefox glitch fix:
    		//	remove title attributes because they interfere with the hover() in Firefox:
    		//	http://dev.jquery.com/ticket/5290
    		if ($.browser.mozilla) {
    			$this.removeAttr('title');
    			$this.find('*[title]').each(function(){
    				$(this).removeAttr('title');
    			});
    		}
    		//	end firefox glitch fix.
        };

		$this.hover(
			function (e) {
				var id = $.data(this), $this = $(this);
				navTimers[id] = setTimeout( function() {
					$this.find(o.child).fadeIn(o.speedIn);
					navTimers[id] = "";
				}, o.delay );
			}, function (e) {
				var id = $.data(this);
				if (navTimers[id] != "") {
					clearTimeout(navTimers[id]);
				} else {
					$(this).find(o.child).fadeOut(o.speedOut);
				}
		});	

	});
};

//
// plugin defaults
//
$.fn.dropdown.defaults = {
	delay: 100,
	speedIn: 200,
	speedOut: 150,
	child: 'ul',
	mozRemoveTitleAttr: true
};

//	public function/method
$.fn.dropdown.ver = function() { return "jquery.dropdown version " + ver; };

})(jQuery);