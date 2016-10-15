var init = function() {
        $(".button").hover(
                           function() {
                           $(this).addClass("hovering");
                           },
                           function() {
                           $(this).removeClass("hovering");
                           }
                           );
        $(".tab").hover(
                           function() {
                           $(this).addClass("hovering");
                           },
                           function() {
                           $(this).removeClass("hovering");
                           }
                           );
}

$(document).ready(init);
