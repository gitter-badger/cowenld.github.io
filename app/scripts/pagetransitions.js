var PageTransitions = (function() {
	var $pages = $( 'div.pt-page' ),
		pagesCount = $pages.length,
		current = 0,
		wheel = 0,
		scrollPos = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		oldDate = new Date(),
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );
		
		// On click scroll up / down
		$( '.js-navDown').on('click', function (el) {
			nextPage();
		});

		$( '.js-navUp').on('click', function (el) {
			prevPage();
		});

		// On keypress
		$(window).keydown(function( event ) {
			console.log(event.which);
			if ( event.which == 38 || event.which == 87 ) { 
				// Up and w
				prevPage();
			}
			else if ( event.which == 40 || event.which == 83 ) {
				// Down and s
				nextPage();
			}
		});

		// On scroll go down
		$('.site-container').on('mousewheel', function(event) { mouseHandle(event); });

	}

	function mouseHandle(event) {
	    newDate = new Date();
	    var scrollAllowed = true;

	    if( wheel < 10 && (newDate.getTime()-oldDate.getTime()) < 100 ) {
	        scrollPos -= event.deltaY*(10-wheel);
	        wheel++;
	    }
	    else {
	        if( (newDate.getTime()-oldDate.getTime()) > 100 ) {
	            wheel = 0;
	            scrollPos -= event.deltaY*60;
	        }
	        else {
	            scrollAllowed = false;
	        }
	    }

	    oldDate = new Date();

	    if( scrollAllowed ) {
	        if(event.deltaY <= 0){
				nextPage();
			}
			else{
				prevPage();
			}
	    }
	}

	function prevPage( animation ) {
		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );

		if( current > -(pagesCount - 1) ) {
			--current;
		}
		else {
			current = 0;
			console.log(current);
		}

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-rotateFoldBottom', inClass = 'pt-page-moveFromTopFade';

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function nextPage( animation ) {
		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );

		if( current < pagesCount - 1 ) {
			++current;
		}
		else {
			current = 0;
			console.log(current);
		}

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-rotateFoldTop', inClass = 'pt-page-moveFromBottomFade';


		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();

	return { init : init };

})();