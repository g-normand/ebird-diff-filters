jQuery.fn.dataTableExt.oApi.fnSetFilteringDelay = function ( oSettings, iDelay ) {
	var _that = this;

	if ( iDelay === undefined ) {
		iDelay = 250;
	}
	 
	this.each( function ( i ) {
		$.fn.dataTableExt.iApiIndex = i;
		var
			$this = this, 
			oTimerId = null, 
			sPreviousSearch = null,
			anControl = $( 'input', _that.fnSettings().aanFeatures.f );
		 
			anControl.unbind( 'keyup' ).bind( 'keyup', function() {
				var $$this = $this;
	 
				if (sPreviousSearch === null || sPreviousSearch != anControl.val()) {
					window.clearTimeout(oTimerId);
					sPreviousSearch = anControl.val();  
					oTimerId = window.setTimeout(function() {
						$.fn.dataTableExt.iApiIndex = i;
						_that.fnFilter( anControl.val() );
						// Added by wjm6
						$('.dataTables_scrollBody').attr('style',''); 
					}, iDelay);
				}
				
				// Added by wjm6
 				if (anControl.val().length > 0) {
 	 				$('#btn-search-clear').show(); 	 
 				} else {
 					$('#btn-search-clear').hide();
 				}

			});
		 
		return this;
	} );
	return this;
};
