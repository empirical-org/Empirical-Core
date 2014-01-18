/*
 * Button loading plugin that appends a container 
 * and positions a css styled loading animator around a given button
 */
(function ( $ ) {
    $.fn.loadingButton = function() {
        var loadingSpinnerClass = "loading-spinner",
        container = this,
        parent = {};

        this.addClass('loading-btn');
        $('body').append('<span class="' + loadingSpinnerClass + '"></span>');
        var buttonPosition = this.offset();
        $('.' + loadingSpinnerClass).css('left', buttonPosition.left + 10).css('top', buttonPosition.top);
        return this;
    };
}( jQuery ));