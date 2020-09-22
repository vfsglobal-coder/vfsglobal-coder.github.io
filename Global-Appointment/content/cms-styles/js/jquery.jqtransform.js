/*

 *
 * Version 1.0 25.09.08
 * Version 1.1 06.08.09
 * Add event click on Checkbox and Radio
 * Auto calculate the size of a select element
 * Can now, disabled the elements
 * Correct bug in ff if click on select (overflow=hidden)
 * No need any more preloading !!
 * 
 ******************************************** */
 
(function($) {
    var defaultOptions = { preloadImg: true };
    var jqTransformImgPreloaded = false;

    var jqTransformPreloadHoverFocusImg = function(strImgUrl) {
        //guillemets to remove for ie
        strImgUrl = strImgUrl.replace(/^url\((.*)\)/, '$1').replace(/^\"(.*)\"$/, '$1');
        var imgHover = new Image();
        imgHover.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-hover.$1');
        var imgFocus = new Image();
        imgFocus.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-focus.$1');
    };


    /***************************
	  Labels
	***************************/
    var jqTransformGetLabel = function(objfield) {
        var selfForm = $(objfield.get(0).form);
        var oLabel = objfield.next();
        if (!oLabel.is('label')) {
            oLabel = objfield.prev();
            if (oLabel.is('label')) {
                var inputname = objfield.attr('id');
                if (inputname) {
                    oLabel = selfForm.find('label[for="' + inputname + '"]');
                }
            }
        }
        if (oLabel.is('label')) {
            return oLabel.css('cursor', 'pointer');
        }
        return false;
    };

    /* Hide all open selects */
    var jqTransformHideSelect = function(oTarget) {
        var ulVisible = $('.jqTransformSelectWrapper ul:visible');
        ulVisible.each(function() {
            var oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
            //do not hide if click on the label object associated to the select
            if (!(oTarget && oSelect.oLabel && oSelect.oLabel.get(0) == oTarget.get(0))) {
                $(this).hide();
            }
        });
    };
    /* Check for an external click */
    var jqTransformCheckExternalClick = function(event) {
        if ($(event.target).parents('.jqTransformSelectWrapper').length === 0) {
            jqTransformHideSelect($(event.target));
        }
    };

    /* Apply document listener */
    var jqTransformAddDocumentListener = function() {
        $(document).mousedown(jqTransformCheckExternalClick);
    };

    /* Add a new handler for the reset action */
    var jqTransformReset = function(f) {
        var sel;
        $('.jqTransformSelectWrapper select', f).each(function() {
            sel = (this.selectedIndex < 0) ? 0 : this.selectedIndex;
            $('ul', $(this).parent()).each(function() { $('a:eq(' + sel + ')', this).click(); });
        });
        $('a.jqTransformCheckbox, a.jqTransformRadio', f).removeClass('jqTransformChecked');
        $('input:checkbox, input:radio', f).each(function() {
            if (this.checked) {
                $('a', $(this).parent()).addClass('jqTransformChecked');
            }
        });
    };
	
	
    /***************************
	  Check Boxes 
	 ***************************/
    $.fn.jqTransCheckBox = function() {
        return this.each(function() {
            if ($(this).hasClass('jqTransformHidden')) {
                return;
            }

            var $input = $(this);
            var inputSelf = this;

            //set the click on the label
            var oLabel = jqTransformGetLabel($input);
            oLabel && oLabel.click(function() { aLink.trigger('click'); });

            var aLink = $('<a href="#" class="jqTransformCheckbox"></a>');
            //wrap and add the link
            $input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink);
            //on change, change the class of the link
            $input.change(function() {
                this.checked && aLink.addClass('jqTransformChecked') || aLink.removeClass('jqTransformChecked');
                return true;
            });
            // Click Handler, trigger the click and change event on the input
            aLink.click(function() {
                //do nothing if the original input is disabled
                if ($input.attr('disabled')) {
                    return false;
                }
                //trigger the envents on the input object
                $input.trigger('click').trigger("change");
                return false;
            });

            // set the default state
            this.checked && aLink.addClass('jqTransformChecked');
        });
    };

    $.fn.jqTransform = function(options) {
        var opt = $.extend({}, defaultOptions, options);

        /* each form */
        return this.each(function() {
            var selfForm = $(this);
            /*if(selfForm.hasClass('jqtransformdone')) {return;}
			selfForm.addClass('jqtransformdone');*/

            $('input:checkbox', this).jqTransCheckBox();

        }); /* End Form each */

    }; /* End the Plugin */

})(jQuery);