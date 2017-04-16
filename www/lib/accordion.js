//Ir añadiendo secciones que tengan accordion
$(function() {
    $('#search_accordion, #routes_accordion' ).on( 'click', '.accordion_button', function () { 
        if ($(this).next('.accordion_content').is(":visible")) {
            $('.accordion_content').slideUp('fast');
        } else {
            $('.accordion_content').slideUp('fast');
            $(this).next('.accordion_content').slideDown('fast');
        };
    });
});