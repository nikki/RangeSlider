/*************************************************
*
*	project:  	rangeSlider
*	author:   	Nicola Hibbert
*	url:	  	http://nicolahibbert.com/range-slider-jquery-plugin
*	demo:	  	http://www.nicolahibbert.com/demo/rangeSlider
*
*	Version:  	0.1.0
*	Copyright: 	(c) 2010-2011 Nicola Hibbert
*
/*************************************************/
;(function($) {
	
	$.fn.rangeSlider = function(options) {
		
		return this.each(function() {

			var defaults = {
				min : 1,
				max : 9,
				step : 1,
				width : '100%',
				height : 15,
				arrows : true,
				arrowW : 20
			},
		
				settings = $.extend({}, defaults, options),
	
				$slider = $(this),
				sliderW = $slider.width(),
				sliderS = settings.arrows ? (sliderW - settings.arrowW * 2) / settings.max : sliderW / settings.max,
				$handle = $slider.append('<a href="#" id="handle"></a>').find('#handle'),
				handleHW = sliderS / 2,
			
				utils = {
					createArrows : function(side) {								
						$slider
							.append('<a href="#" id="jqrs-' + side + '"></a>')
							.find('#jqrs-' + side)
							.css({
								left : side === 'left' ? 0 : sliderW - settings.arrowW,
								height : settings.height,
								width : settings.arrowW
							})
							.click(function(e) {
								var sData = $slider.data('step'),
									stepDir;
							
								e.preventDefault();	
					
								if (side === 'left') {
									stepDir = sData > 0 ? sData -= 1 : 0;								
								} else {
									stepDir = sData < settings.max - 1 ? sData += 1 : settings.max - 1;							
								}
					
								$slider
									.data({ step : sData })
									.trigger('moveStep', { step : stepDir });
							});
					},
					dragging : false
				};
		
			$slider
				.css({
					width : sliderW,
					height : settings.height
				})
				.bind('moveStep', function(e, data) {
					$handle.css('left', settings.arrows ? (data.step * sliderS) + settings.arrowW : data.step * sliderS);
				})
				.data({ step : settings.max % 2 === 0 ? settings.max / 2 - 1 : Math.floor(settings.max / 2) });
						
			$handle
				.css({
					left : settings.max % 2 === 0 ? sliderW / 2 - sliderS : sliderW / 2 - handleHW,
					height : settings.height,
					width : sliderS
				})
				.bind({
					click : function() { return false; },
					mousedown : function() { utils.dragging = true; return false; }
				});
			
			$(document).bind({
				mouseup : function() { utils.dragging = false; return false; },
				mousemove : function(e) {
					var offset = $slider.offset(),
						posX = e.pageX,
						stepPos = Math.floor((posX - offset.left - handleHW) / sliderS);

					if (utils.dragging) {
						if (posX - handleHW > offset.left && posX < offset.left + sliderW) {	
							$slider
								.data({ step : stepPos })
								.trigger('moveStep', { step : stepPos });
						}
						return false;
					}					
				}
			});

			if (settings.arrows) {	
				utils.createArrows('left');
				utils.createArrows('right');
			}		
			
		});	
					
	};

})(jQuery);